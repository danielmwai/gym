import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PaymentModal from "@/components/payment-modal";
import { useState } from "react";
import type { MembershipPlan } from "@shared/schema";

export default function MembershipSection() {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { data: plans, isLoading } = useQuery<MembershipPlan[]>({
    queryKey: ["/api/membership-plans"],
  });

  const defaultPlans = [
    {
      id: "1",
      name: "Basic",
      description: "Perfect for getting started on your fitness journey",
      price: "3500",
      duration: 30,
      features: [
        "Gym access during off-peak hours",
        "Basic equipment usage", 
        "Locker room access"
      ],
      popular: false
    },
    {
      id: "2",
      name: "Premium",
      description: "Most popular choice for dedicated fitness enthusiasts", 
      price: "6500",
      duration: 30,
      features: [
        "24/7 gym access",
        "All equipment + classes",
        "Personal training sessions",
        "Spa access"
      ],
      popular: true
    },
    {
      id: "3",
      name: "VIP",
      description: "Ultimate wellness experience with exclusive benefits",
      price: "9500", 
      duration: 30,
      features: [
        "All Premium benefits",
        "Nutrition consultations",
        "Wellness workshops",
        "Guest passes (2/month)"
      ],
      popular: false
    }
  ];

  const displayPlans = plans && plans.length > 0 ? plans : defaultPlans;

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  return (
    <>
      <section id="membership" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-membership-title">
              It's Your Turn!
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-membership-subtitle">
              Join a growing community of Nairobi women transforming their health and confidence — all in a space created just for them.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="p-8 text-center">
                  <Skeleton className="h-8 w-24 mx-auto mb-4" />
                  <Skeleton className="h-12 w-32 mx-auto mb-6" />
                  <div className="space-y-3 mb-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                  <Skeleton className="h-12 w-full" />
                </Card>
              ))
            ) : (
              displayPlans.map((plan, index) => (
                <Card 
                  key={plan.id} 
                  className={`p-8 text-center relative ${
                    plan.popular ? 'border-2 border-primary shadow-xl' : 'shadow-lg'
                  }`}
                  data-testid={`card-membership-plan-${index}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-foreground mb-4" data-testid={`text-plan-name-${index}`}>
                      {plan.name}
                    </CardTitle>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-primary" data-testid={`text-plan-price-${index}`}>
                        KES {plan.price}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-8 text-left">
                      {(Array.isArray(plan.features) ? plan.features : []).map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                          <span data-testid={`text-plan-feature-${index}-${featureIndex}`}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3 rounded-full font-semibold smooth-transition ${
                        plan.popular 
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                          : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                      }`}
                      data-testid={`button-select-plan-${index}`}
                    >
                      Select Plan
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={selectedPlan}
        type="membership"
      />
    </>
  );
}
