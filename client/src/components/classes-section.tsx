import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { FitnessClass } from "@shared/schema";

export default function ClassesSection() {
  const { data: classes, isLoading } = useQuery<FitnessClass[]>({
    queryKey: ["/api/classes"],
  });

  const defaultClasses = [
    {
      id: "1",
      name: "HIIT Training",
      description: "High-intensity interval training to boost your metabolism and strength",
      duration: 45,
      level: "Intermediate",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
    },
    {
      id: "2", 
      name: "Yoga Flow",
      description: "Flowing movements to improve flexibility, balance, and mindfulness",
      duration: 60,
      level: "All Levels",
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
    },
    {
      id: "3",
      name: "Strength Training", 
      description: "Build lean muscle and improve overall strength with guided workouts",
      duration: 50,
      level: "Beginner",
      imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
    }
  ];

  const displayClasses = classes && classes.length > 0 ? classes : defaultClasses;

  const getLevelVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'secondary';
      case 'intermediate': return 'default';
      case 'advanced': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <section id="classes" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-classes-title">
            Our Classes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-classes-subtitle">
            Join empowering fitness classes designed specifically for women in a supportive environment
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            displayClasses.map((fitnessClass, index) => (
              <Card 
                key={fitnessClass.id} 
                className="overflow-hidden group hover:shadow-xl smooth-transition"
                data-testid={`card-class-${index}`}
              >
                <img 
                  src={fitnessClass.imageUrl} 
                  alt={`${fitnessClass.name} class`}
                  className="w-full h-48 object-cover group-hover:scale-105 smooth-transition" 
                  data-testid={`img-class-${index}`}
                />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-foreground" data-testid={`text-class-name-${index}`}>
                      {fitnessClass.name}
                    </h3>
                    <Badge variant={getLevelVariant(fitnessClass.level)} data-testid={`badge-class-level-${index}`}>
                      {fitnessClass.level}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4" data-testid={`text-class-description-${index}`}>
                    {fitnessClass.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span data-testid={`text-class-duration-${index}`}>{fitnessClass.duration} min</span>
                    </div>
                    <Button size="sm" data-testid={`button-book-class-${index}`}>
                      Book Class
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
