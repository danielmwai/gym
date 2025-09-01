import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

const checkoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(1, "Full name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().optional(),
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: {
        fullName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
        phone: '',
        address: '',
        city: 'Nairobi',
        postalCode: '',
      },
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue with checkout.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 2000);
    }
  }, [isAuthenticated, toast]);

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      initiatePayment(order);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessingPayment(false);
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const response = await apiRequest("POST", "/api/payments/stk-push", paymentData);
      return response.json();
    },
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Payment Initiated",
          description: "Please check your phone for the M-Pesa prompt.",
        });
        // Poll for payment status
        checkPaymentStatus(result.paymentId);
      } else {
        throw new Error(result.message || "Payment initiation failed");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessingPayment(false);
    },
  });

  const initiatePayment = (order: any) => {
    const formData = form.getValues();
    paymentMutation.mutate({
      phoneNumber: formData.shippingAddress.phone,
      amount: getTotal(),
      orderId: order.id,
      accountReference: `ORDER-${order.id}`,
    });
  };

  const checkPaymentStatus = async (paymentId: string) => {
    const maxAttempts = 30; // 5 minutes with 10s intervals
    let attempts = 0;

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/payments/${paymentId}/status`);
        const result = await response.json();
        
        if (result.status === 'completed') {
          clearCart();
          toast({
            title: "Order Successful!",
            description: "Your payment has been processed and order confirmed.",
          });
          setLocation('/orders');
          return;
        } else if (result.status === 'failed') {
          throw new Error("Payment was cancelled or failed");
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(pollStatus, 10000); // Check every 10 seconds
        } else {
          throw new Error("Payment verification timed out");
        }
      } catch (error: any) {
        toast({
          title: "Payment Status Check Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsProcessingPayment(false);
      }
    };

    pollStatus();
  };

  const onSubmit = (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingPayment(true);
    createOrderMutation.mutate({
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      total: getTotal(),
      shippingAddress: data.shippingAddress,
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground mb-4" data-testid="text-empty-cart-title">
                Your cart is empty
              </h1>
              <p className="text-muted-foreground mb-8" data-testid="text-empty-cart-description">
                Add some products to your cart to continue shopping.
              </p>
              <Button onClick={() => setLocation('/shop')} data-testid="button-continue-shopping">
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8" data-testid="text-checkout-title">
            Checkout
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-order-summary-title">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-3" data-testid={`item-${item.id}`}>
                      <img 
                        src={item.imageUrl || "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg" 
                        data-testid={`img-item-${item.id}`}
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground" data-testid={`text-item-name-${item.id}`}>
                          {item.name}
                        </h3>
                        <p className="text-primary font-bold" data-testid={`text-item-price-${item.id}`}>
                          KES {item.price}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isProcessingPayment}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center" data-testid={`text-item-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isProcessingPayment}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          disabled={isProcessingPayment}
                          data-testid={`button-remove-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary" data-testid="text-total-amount">
                      KES {getTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-shipping-title">Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        {...form.register("shippingAddress.fullName")}
                        disabled={isProcessingPayment}
                        data-testid="input-full-name"
                      />
                      {form.formState.errors.shippingAddress?.fullName && (
                        <p className="text-destructive text-sm">
                          {form.formState.errors.shippingAddress.fullName.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number (for M-Pesa)</Label>
                      <Input
                        id="phone"
                        placeholder="254712345678"
                        {...form.register("shippingAddress.phone")}
                        disabled={isProcessingPayment}
                        data-testid="input-phone"
                      />
                      {form.formState.errors.shippingAddress?.phone && (
                        <p className="text-destructive text-sm">
                          {form.formState.errors.shippingAddress.phone.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        {...form.register("shippingAddress.address")}
                        disabled={isProcessingPayment}
                        data-testid="input-address"
                      />
                      {form.formState.errors.shippingAddress?.address && (
                        <p className="text-destructive text-sm">
                          {form.formState.errors.shippingAddress.address.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          {...form.register("shippingAddress.city")}
                          disabled={isProcessingPayment}
                          data-testid="input-city"
                        />
                        {form.formState.errors.shippingAddress?.city && (
                          <p className="text-destructive text-sm">
                            {form.formState.errors.shippingAddress.city.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="postalCode">Postal Code (Optional)</Label>
                        <Input
                          id="postalCode"
                          {...form.register("shippingAddress.postalCode")}
                          disabled={isProcessingPayment}
                          data-testid="input-postal-code"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Payment Method</h3>
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">M</span>
                      </div>
                      <div>
                        <p className="font-medium">M-Pesa</p>
                        <p className="text-sm text-muted-foreground">Pay securely with M-Pesa</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isProcessingPayment || createOrderMutation.isPending || paymentMutation.isPending}
                    data-testid="button-place-order"
                  >
                    {isProcessingPayment 
                      ? "Processing Payment..." 
                      : `Place Order - KES ${getTotal().toFixed(2)}`
                    }
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
