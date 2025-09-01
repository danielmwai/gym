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

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
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
