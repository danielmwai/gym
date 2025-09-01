import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { Link } from "wouter";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function ShoppingCart() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotal, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40" 
        onClick={closeCart}
        data-testid="backdrop-cart-overlay"
      />
      
      {/* Cart Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-xl">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2" data-testid="text-cart-title">
                <ShoppingBag className="h-5 w-5" />
                Shopping Cart
                {items.length > 0 && (
                  <Badge variant="secondary" data-testid="badge-cart-item-count">
                    {items.length}
                  </Badge>
                )}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={closeCart}
                data-testid="button-close-cart"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-0">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="text-empty-cart-title">
                  Your cart is empty
                </h3>
                <p className="text-muted-foreground mb-4" data-testid="text-empty-cart-description">
                  Add some products to get started
                </p>
                <Button asChild onClick={closeCart} data-testid="button-start-shopping">
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center gap-3 p-3 border rounded-lg"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <img 
                      src={item.imageUrl || "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg" 
                      data-testid={`img-cart-item-${item.id}`}
                    />
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground text-sm" data-testid={`text-cart-item-name-${item.id}`}>
                        {item.name}
                      </h4>
                      <p className="text-primary font-semibold text-sm" data-testid={`text-cart-item-price-${item.id}`}>
                        KES {item.price}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 p-0"
                          data-testid={`button-decrease-quantity-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="text-sm font-medium w-8 text-center" data-testid={`text-cart-item-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 p-0"
                          data-testid={`button-increase-quantity-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-6 w-6 p-0 ml-2 text-destructive hover:text-destructive"
                          data-testid={`button-remove-item-${item.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-foreground" data-testid={`text-cart-item-total-${item.id}`}>
                        KES {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {items.length > 0 && (
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCart}
                      className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      data-testid="button-clear-cart"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Cart
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>

          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span data-testid="text-cart-subtotal">KES {getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping:</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-primary" data-testid="text-cart-total">
                    KES {getTotal().toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  asChild 
                  className="w-full"
                  onClick={closeCart}
                  data-testid="button-proceed-to-checkout"
                >
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button 
                  variant="outline" 
                  asChild 
                  className="w-full"
                  onClick={closeCart}
                  data-testid="button-continue-shopping"
                >
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
