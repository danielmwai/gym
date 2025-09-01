import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, MapPin, Calendar } from "lucide-react";
import type { FitnessClass, ClassSchedule } from "@shared/schema";

export default function ClassesPage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const { data: classes, isLoading: classesLoading } = useQuery<FitnessClass[]>({
    queryKey: ["/api/classes"],
  });

  const { data: schedules, isLoading: schedulesLoading } = useQuery<ClassSchedule[]>({
    queryKey: ["/api/classes", selectedClass, "schedules"],
    enabled: !!selectedClass,
  });

  const classTypes = [
    {
      category: "strength",
      name: "Strength & Conditioning",
      description: "Build lean muscle and improve overall strength",
      classes: ["Strength Training", "HIIT Training", "Functional Fitness"]
    },
    {
      category: "mindfulness", 
      name: "Mind & Body",
      description: "Focus on flexibility, balance, and mental wellness",
      classes: ["Yoga Flow", "Pilates", "Meditation"]
    },
    {
      category: "cardio",
      name: "Cardio & Dance",
      description: "High-energy workouts to boost cardiovascular health",
      classes: ["Zumba", "Dance Fitness", "Spinning"]
    }
  ];

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const defaultClasses = [
    {
      id: "1",
      name: "HIIT Training",
      description: "High-intensity interval training combining strength and cardio for maximum calorie burn and muscle building",
      duration: 45,
      level: "Intermediate",
      instructor: "Sarah Johnson",
      maxCapacity: 20,
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      active: true
    },
    {
      id: "2",
      name: "Yoga Flow",
      description: "Dynamic flowing movements that improve flexibility, balance, and mindfulness through breath work",
      duration: 60,
      level: "All Levels", 
      instructor: "Maya Patel",
      maxCapacity: 15,
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      active: true
    },
    {
      id: "3",
      name: "Strength Training",
      description: "Build lean muscle and functional strength with progressive weight training designed for women",
      duration: 50,
      level: "Beginner",
      instructor: "Lisa Chen",
      maxCapacity: 12,
      imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      active: true
    },
    {
      id: "4",
      name: "Pilates Core",
      description: "Focus on core strength, stability, and posture improvement through controlled movements",
      duration: 55,
      level: "Intermediate",
      instructor: "Emma Williams",
      maxCapacity: 18,
      imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      active: true
    }
  ];

  const displayClasses = classes && classes.length > 0 ? classes : defaultClasses;

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
            alt="Women in fitness class" 
            className="w-full h-full object-cover opacity-20" 
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="text-classes-hero-title">
            Fitness Classes
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto" data-testid="text-classes-hero-subtitle">
            Empowering group fitness classes designed specifically for women in a supportive environment
          </p>
        </div>
      </section>

      {/* Class Categories */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-categories-title">
              Find Your Perfect Class
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose from our diverse range of fitness programs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {classTypes.map((type, index) => (
              <Card key={type.category} className="text-center group hover:shadow-lg smooth-transition">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2" data-testid={`text-category-name-${index}`}>
                    {type.name}
                  </h3>
                  <p className="text-muted-foreground mb-4" data-testid={`text-category-description-${index}`}>
                    {type.description}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {type.classes.map((className, classIndex) => (
                      <Badge key={classIndex} variant="secondary" className="text-xs">
                        {className}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-classes-grid-title">
              All Classes
            </h2>
          </div>
          
          {classesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-10 w-full mt-4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayClasses.map((fitnessClass, index) => (
                <Card 
                  key={fitnessClass.id} 
                  className="overflow-hidden group hover:shadow-xl smooth-transition"
                  data-testid={`card-class-${index}`}
                >
                  <div className="relative">
                    <img 
                      src={fitnessClass.imageUrl || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"} 
                      alt={fitnessClass.name}
                      className="w-full h-48 object-cover group-hover:scale-105 smooth-transition" 
                      data-testid={`img-class-${index}`}
                    />
                    <Badge 
                      className={`absolute top-3 left-3 ${getLevelColor(fitnessClass.level)}`}
                      data-testid={`badge-class-level-${index}`}
                    >
                      {fitnessClass.level}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-foreground" data-testid={`text-class-name-${index}`}>
                        {fitnessClass.name}
                      </h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed" data-testid={`text-class-description-${index}`}>
                      {fitnessClass.description}
                    </p>
                    
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        <span data-testid={`text-class-duration-${index}`}>{fitnessClass.duration} minutes</span>
                      </div>
                      
                      {fitnessClass.instructor && (
                        <div className="flex items-center text-muted-foreground">
                          <Users className="h-4 w-4 mr-2" />
                          <span data-testid={`text-class-instructor-${index}`}>Instructor: {fitnessClass.instructor}</span>
                        </div>
                      )}
                      
                      {fitnessClass.maxCapacity && (
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span data-testid={`text-class-capacity-${index}`}>Max {fitnessClass.maxCapacity} participants</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={() => setSelectedClass(fitnessClass.id)}
                        data-testid={`button-view-schedule-${index}`}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        View Schedule
                      </Button>
                      <Button 
                        variant="outline"
                        data-testid={`button-book-class-${index}`}
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Schedule Modal would go here - simplified for now */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Class Schedule
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedClass(null)}
                  data-testid="button-close-schedule"
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Schedule information would be displayed here based on the selected class.
              </p>
              <Button 
                className="w-full"
                data-testid="button-book-selected-class"
              >
                Book This Class
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}
