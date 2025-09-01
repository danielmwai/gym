import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ClassesSection from "@/components/classes-section";
import TestimonialsSection from "@/components/testimonials-section";
import MembershipSection from "@/components/membership-section";
import ShopSection from "@/components/shop-section";
import NewsletterSection from "@/components/newsletter-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import ShoppingCart from "@/components/shopping-cart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { user } = useAuth();
  
  const { data: membership } = useQuery({
    queryKey: ["/api/membership/current"],
    enabled: !!user,
  });

  const { data: orders } = useQuery({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Member Dashboard Section */}
      <section className="pt-20 pb-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-welcome">
              Welcome back, {user?.firstName || 'Member'}!
            </h1>
            <p className="text-muted-foreground">
              Ready to continue your fitness journey with the FeminaFit sisterhood?
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Membership Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Membership
                  {membership && (
                    <Badge variant="secondary" data-testid="badge-membership-status">
                      {membership.status}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {membership ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Active until:</p>
                    <p className="font-semibold" data-testid="text-membership-end">
                      {new Date(membership.endDate).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground" data-testid="text-no-membership">
                    No active membership
                  </p>
                )}
              </CardContent>
            </Card>
            
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders && orders.length > 0 ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Last order:</p>
                    <p className="font-semibold" data-testid="text-last-order">
                      KES {orders[0]?.total}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground" data-testid="text-no-orders">
                    No orders yet
                  </p>
                )}
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg text-sm font-medium smooth-transition"
                  data-testid="button-book-class"
                >
                  Book a Class
                </button>
                <button 
                  className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 rounded-lg text-sm font-medium smooth-transition"
                  data-testid="button-shop-now"
                >
                  Shop Now
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <HeroSection />
      <AboutSection />
      <ClassesSection />
      <TestimonialsSection />
      <MembershipSection />
      <ShopSection />
      <NewsletterSection />
      <ContactSection />
      <Footer />
      <ShoppingCart />
    </div>
  );
}
