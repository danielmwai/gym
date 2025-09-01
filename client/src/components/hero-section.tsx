import { Button } from "@/components/ui/button";
import { ChevronDown, Play } from "lucide-react";

export default function HeroSection() {
  const handleScrollToAbout = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-gradient min-h-screen flex items-center relative overflow-hidden">
      {/* Hero background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080" 
          alt="Women exercising in modern gym" 
          className="w-full h-full object-cover opacity-20" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-purple-600/50"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
            <span className="block">Your space.</span>
            <span className="block">Your Health.</span>
            <span className="block text-accent">Your Sisterhood</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90" data-testid="text-hero-subtitle">
            Finally — a high-end gym designed only for women, like you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-full font-semibold text-lg smooth-transition"
              onClick={handleScrollToAbout}
              data-testid="button-discover-more"
            >
              Discover More
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-full font-semibold text-lg smooth-transition"
              data-testid="button-watch-tour"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Tour
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <button onClick={handleScrollToAbout} data-testid="button-scroll-down">
          <ChevronDown className="h-8 w-8" />
        </button>
      </div>
    </section>
  );
}
