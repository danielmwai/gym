import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import PaymentModal from "@/components/payment-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { Check, Star, Clock, Users, Dumbbell, Sparkles } from "lucide-react";
import type { MembershipPlan, Membership } from "@shared/schema";

export default function MembershipPage() {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { isAuthenticated } = useAuth();

  const { data: plans, isLoading: plansLoading } = useQuery<MembershipPlan[]>({
    queryKey: ["/api/membership-plans"],
  });

  const { data: currentMembership } = useQuery<Membership>({
    queryKey: ["/api/membership/current"],
    enabled: isAuthenticated,
  });

  const benefits = [
    {
      icon: Users,
      title: "Women-Only Environment",
      description: "Safe, supportive space designed exclusively for women"
    },
    {
      icon: Dumbbell,
      title: "State-of-the-Art Equipment",
      description: "Premium equipment designed for women's fitness needs"
    },
    {
      icon: Star,
      title: "Expert Female Trainers",
      description: "Certified trainers who understand women's unique health needs"
    },
    {
      icon: Sparkles,
      title: "Spa & Wellness",
      description: "Recovery and relaxation facilities for complete wellness"
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Extended hours to fit your busy lifestyle"
    }
  ];

  const handleSelectPlan = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
            alt="Women supporting each other in fitness journey" 
            className="w-full h-full object-cover opacity-20" 
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="text-membership-hero-title">
            Join the Sisterhood
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8" data-testid="text-membership-hero-subtitle">
            Transform your health and confidence in Nairobi's premier women-only fitness sanctuary
          </p>
          
          {currentMembership && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
              <h3 className="text-white font-semibold mb-2">Your Current Membership</h3>
              <p className="text-white/80 text-sm">
                Active until {new Date(currentMembership.endDate).toLocaleDateString()}
              </p>
              <Badge className="mt-2 bg-accent text-accent-foreground">
                {currentMembership.status}
              </Badge>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-benefits-title">
              Why Choose FeminaFit?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              More than a gym - your complete wellness destination
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="text-center group hover:shadow-lg smooth-transition">
                  <CardContent className="p-6">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 smooth-transition">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2" data-testid={`text-benefit-title-${index}`}>
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground" data-testid={`text-benefit-description-${index}`}>
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-plans-title">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Flexible membership options to fit your lifestyle and goals
            </p>
          </div>
          
          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
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
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans?.map((plan, index) => (
                <Card 
                  key={plan.id} 
                  className={`p-8 text-center relative ${
                    plan.popular ? 'border-2 border-primary shadow-xl scale-105' : 'shadow-lg'
                  }`}
                  data-testid={`card-membership-plan-${index}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-foreground mb-4" data-testid={`text-plan-name-${index}`}>
                      {plan.name}
                    </CardTitle>
                    <div className="mb-6">
                      <span className="text-5xl font-bold text-primary" data-testid={`text-plan-price-${index}`}>
                        KES {plan.price}
                      </span>
                      <span className="text-muted-foreground text-lg">/month</span>
                    </div>
                    <p className="text-muted-foreground mb-6" data-testid={`text-plan-description-${index}`}>
                      {plan.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-4 mb-8 text-left">
                      {(Array.isArray(plan.features) ? plan.features : []).map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-foreground" data-testid={`text-plan-feature-${index}-${featureIndex}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-4 rounded-full font-semibold text-lg smooth-transition ${
                        plan.popular 
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                          : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                      }`}
                      data-testid={`button-select-plan-${index}`}
                    >
                      {currentMembership ? 'Upgrade Plan' : 'Get Started'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-cta-title">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-muted-foreground mb-8" data-testid="text-cta-description">
            Join hundreds of women who have already made FeminaFit their wellness home
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild data-testid="button-visit-gym">
              <a href="#contact">Visit Our Gym</a>
            </Button>
            <Button variant="outline" size="lg" data-testid="button-learn-more">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={selectedPlan}
        type="membership"
      />
      
      <Footer />
    </div>
  );
}
