import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      content: "3rd Floor, Lana Plaza\nNairobi, Kenya",
      href: null
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+254116784310",
      href: "tel:+254116784310"
    },
    {
      icon: Mail,
      title: "Email",
      content: "feminafit59@gmail.com",
      href: "mailto:feminafit59@gmail.com"
    },
    {
      icon: Clock,
      title: "Hours",
      content: "Mon-Fri: 5:00 AM - 10:00 PM\nWeekends: 6:00 AM - 8:00 PM",
      href: null
    }
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://www.facebook.com/share/1FKi2nGzZj/?mibextid=wwXIfr",
      label: "Facebook"
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/feminafit2?igsh=MXhyYjkyYXhpeDNkZQ==&utm_source=qr",
      label: "Instagram"
    },
    {
      icon: () => (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-2.54v5.79c0 1.37-.81 2.57-1.96 3.14A3.19 3.19 0 0 1 9 10.8a3.2 3.2 0 1 1 3.2-3.2c0 .17-.01.34-.04.5l2.8-1.64c.28-.17.63-.1.84.15.2.25.23.59.07.87l-2.84 4.93c.35.07.71.11 1.08.11 1.76 0 3.2-1.44 3.2-3.2 0-.17-.01-.34-.04-.5z"/>
        </svg>
      ),
      href: "https://www.tiktok.com/@feminafitgym?_t=ZM-8yoKmRJyfZg&_r=1",
      label: "TikTok"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8" data-testid="text-contact-title">
              Get in Touch
            </h2>
            
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1" data-testid={`text-contact-info-title-${index}`}>
                        {info.title}
                      </h3>
                      {info.href ? (
                        <a 
                          href={info.href} 
                          className="text-muted-foreground hover:text-primary smooth-transition whitespace-pre-line"
                          data-testid={`link-contact-info-${index}`}
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-muted-foreground whitespace-pre-line" data-testid={`text-contact-info-content-${index}`}>
                          {info.content}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4" data-testid="text-follow-us-title">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary/10 hover:bg-primary hover:text-white text-primary p-3 rounded-full smooth-transition"
                      aria-label={social.label}
                      data-testid={`link-social-${social.label.toLowerCase()}`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6" data-testid="text-contact-form-title">
                Send us a Message
              </h3>
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    className="mt-1"
                    disabled={contactMutation.isPending}
                    data-testid="input-contact-name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-destructive text-sm mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    className="mt-1"
                    disabled={contactMutation.isPending}
                    data-testid="input-contact-email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-destructive text-sm mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...form.register("phone")}
                    className="mt-1"
                    disabled={contactMutation.isPending}
                    data-testid="input-contact-phone"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    {...form.register("message")}
                    className="mt-1"
                    disabled={contactMutation.isPending}
                    data-testid="textarea-contact-message"
                  />
                  {form.formState.errors.message && (
                    <p className="text-destructive text-sm mt-1">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  className="w-full py-3 font-semibold smooth-transition"
                  disabled={contactMutation.isPending}
                  data-testid="button-send-message"
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
