import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Testimonial } from "@shared/schema";

export default function TestimonialsSection() {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials", { featured: true }],
  });

  const defaultTestimonials = [
    {
      id: "1",
      name: "Zaytuna Muasya",
      username: "@zaytuna_muasya",
      text: "Only women is so lovely! We want more of these gyms.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b098?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60",
    },
    {
      id: "2",
      name: "Spicy Efuru", 
      username: "@spicyefuru",
      text: "So healing!!! Waiting for the ladies to join me.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60",
    },
    {
      id: "3",
      name: "Member Fit",
      username: "@memberfit24", 
      text: "This place has transformed my relationship with fitness. The community here is incredible!",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60",
    }
  ];

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-testimonials-title">
            Real Women. Real Stories.
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="text-testimonials-subtitle">
            Hear from our amazing members!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="w-4 h-4" />
                    ))}
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex items-center">
                  <Skeleton className="w-12 h-12 rounded-full mr-3" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </Card>
            ))
          ) : (
            displayTestimonials.map((testimonial, index) => (
              <Card key={testimonial.id} className="p-6" data-testid={`card-testimonial-${index}`}>
                <div className="flex items-center mb-4">
                  <div className="flex text-accent">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-foreground mb-4 italic" data-testid={`text-testimonial-text-${index}`}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.imageUrl || "https://images.unsplash.com/photo-1494790108755-2616b612b098?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-3 object-cover" 
                    data-testid={`img-testimonial-avatar-${index}`}
                  />
                  <div>
                    <p className="font-semibold text-foreground" data-testid={`text-testimonial-author-${index}`}>
                      {testimonial.username || testimonial.name}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
