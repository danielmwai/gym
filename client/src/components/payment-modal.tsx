import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, CreditCard } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { MembershipPlan } from "@shared/schema";

const paymentSchema = z.object({
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^(\+?254|0)?[17]\d{8}$/, "Please enter a valid Kenyan phone number"),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan | null;
  type: 'membership' | 'order';
  orderId?: string;
}

export default function PaymentModal({ isOpen, onClose, plan, type, orderId }: PaymentModalProps) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/payments/stk-push", data);
      return response.json();
    },
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Payment Initiated",
          description: "Please check your phone for the M-Pesa prompt and enter your PIN.",
        });
        setIsProcessingPayment(true);
        // Start polling for payment status
        checkPaymentStatus(result.paymentId);
      } else {
        throw new Error(result.message || "Payment initiation failed");
      }
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
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const checkPaymentStatus = async (paymentId: string) => {
    const maxAttempts = 30; // 5 minutes with 10s intervals
    let attempts = 0;

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/payments/${paymentId}/status`);
        const result = await response.json();
        
        if (result.status === 'completed') {
          toast({
            title: "Payment Successful!",
            description: type === 'membership' 
              ? "Your membership has been activated. Welcome to FeminaFit!" 
              : "Your order has been confirmed and will be processed soon.",
          });
          setIsProcessingPayment(false);
          onClose();
          return;
        } else if (result.status === 'failed') {
          throw new Error("Payment was cancelled or failed");
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(pollStatus, 10000); // Check every 10 seconds
        } else {
          throw new Error("Payment verification timed out. Please contact support if payment was deducted.");
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

  const onSubmit = (data: PaymentFormData) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue with payment.",
        variant: "destructive",
      });
      window.location.href = "/api/login";
      return;
    }

    if (!plan && type === 'membership') {
      toast({
        title: "No Plan Selected",
        description: "Please select a membership plan first.",
        variant: "destructive",
      });
      return;
    }

    const paymentData = {
      phoneNumber: data.phoneNumber,
      amount: parseFloat(plan?.price || "0"),
      accountReference: type === 'membership' 
        ? `MEMBERSHIP-${plan?.id}` 
        : `ORDER-${orderId}`,
      ...(type === 'membership' && { membershipPlanId: plan?.id }),
      ...(type === 'order' && { orderId }),
    };

    paymentMutation.mutate(paymentData);
  };

  const handleClose = () => {
    if (!isProcessingPayment) {
      onClose();
      form.reset();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50" 
        onClick={handleClose}
        data-testid="backdrop-payment-modal"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2" data-testid="text-payment-modal-title">
                <CreditCard className="h-5 w-5" />
                Complete Payment
              </CardTitle>
              {!isProcessingPayment && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClose}
                  data-testid="button-close-payment-modal"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Order Summary */}
            {plan && (
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2" data-testid="text-order-summary-title">
                  {type === 'membership' ? 'Membership Plan' : 'Order Summary'}
                </h3>
                <div className="flex justify-between items-center">
                  <span data-testid="text-plan-name">{plan.name}</span>
                  <span className="font-bold text-primary" data-testid="text-plan-price">
                    KES {plan.price}
                  </span>
                </div>
                {type === 'membership' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Monthly subscription
                  </p>
                )}
              </div>
            )}

            <Separator />

            {/* Payment Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="phoneNumber">M-Pesa Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="e.g., 0712345678 or 254712345678"
                  {...form.register("phoneNumber")}
                  disabled={isProcessingPayment || paymentMutation.isPending}
                  className="mt-1"
                  data-testid="input-phone-number"
                />
                {form.formState.errors.phoneNumber && (
                  <p className="text-destructive text-sm mt-1">
                    {form.formState.errors.phoneNumber.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  You will receive an M-Pesa prompt on this number
                </p>
              </div>

              {/* Payment Method Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">M</span>
                  </div>
                  <span className="font-medium text-green-800">M-Pesa Payment</span>
                </div>
                <p className="text-sm text-green-700">
                  You will receive an STK push notification on your phone. Enter your M-Pesa PIN to complete the payment.
                </p>
              </div>

              {/* Total Amount */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-primary" data-testid="text-total-amount">
                    KES {plan?.price || "0"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isProcessingPayment || paymentMutation.isPending}
                  className="flex-1"
                  data-testid="button-cancel-payment"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessingPayment || paymentMutation.isPending}
                  className="flex-1"
                  data-testid="button-pay-now"
                >
                  {isProcessingPayment 
                    ? "Processing..." 
                    : paymentMutation.isPending 
                    ? "Initiating..." 
                    : "Pay Now"
                  }
                </Button>
              </div>
            </form>

            {isProcessingPayment && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700 text-center">
                  <span className="font-medium">Payment in progress...</span><br />
                  Please complete the payment on your phone. Do not close this window.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
