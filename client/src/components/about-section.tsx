import { Heart, Dumbbell, Users } from "lucide-react";

export default function AboutSection() {
  const features = [
    {
      icon: Heart,
      title: "Trainers Who Understand",
      description: "Trainers who understand women's unique health needs to help you along your journey."
    },
    {
      icon: Dumbbell,
      title: "Equipment Designed for You",
      description: "Equipment and programs designed for your Body to help equip you for your journey towards life long health."
    },
    {
      icon: Users,
      title: "Sisterhood Community",
      description: "A sisterhood community to walk with and cheer you on every step of the way."
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Women supporting each other during workout" 
              className="rounded-2xl shadow-lg w-full" 
              data-testid="img-about-hero"
            />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="text-about-title">
              Feel Strong, Confident, and at Home at{" "}
              <span className="text-primary">Femina Fit</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed" data-testid="text-about-description">
              At FeminaFit, you'll never feel out of place or judged. This is your private, women-only space in Lana Plaza, Nairobi — designed for your health, your comfort, and your goals. From energising workouts to spa-like recovery, everything here helps you feel your best inside and out.
            </p>
            
            <div className="space-y-4">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground" data-testid={`text-feature-title-${index}`}>
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground" data-testid={`text-feature-description-${index}`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
