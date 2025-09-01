import { Link } from "wouter";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { href: "#about", label: "About" },
    { href: "/classes", label: "Classes" },
    { href: "/membership", label: "Membership" },
    { href: "/shop", label: "Shop" },
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

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4" data-testid="link-footer-logo">
              <h3 className="text-2xl font-bold text-primary">FeminaFit</h3>
            </Link>
            <p className="text-background/80 mb-6 max-w-md" data-testid="text-footer-description">
              Join our community of strong women today. Your space. Your health. Your sisterhood.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-background/60 hover:text-primary smooth-transition"
                    aria-label={social.label}
                    data-testid={`link-footer-social-${social.label.toLowerCase()}`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-background mb-4" data-testid="text-quick-links-title">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="text-background/80 hover:text-primary smooth-transition"
                    data-testid={`link-footer-nav-${link.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h4 className="font-semibold text-background mb-4" data-testid="text-contact-info-title">
              Contact
            </h4>
            <ul className="space-y-3 text-background/80">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                <span data-testid="text-footer-address">3rd Floor, Lana Plaza<br />Nairobi, Kenya</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <a 
                  href="tel:+254116784310" 
                  className="hover:text-primary smooth-transition"
                  data-testid="link-footer-phone"
                >
                  +254116784310
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <a 
                  href="mailto:feminafit59@gmail.com" 
                  className="hover:text-primary smooth-transition"
                  data-testid="link-footer-email"
                >
                  feminafit59@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-background/60 text-sm" data-testid="text-copyright">
              &copy; 2025 FeminaFit. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a 
                href="/privacy" 
                className="text-background/60 hover:text-primary text-sm smooth-transition"
                data-testid="link-privacy"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-background/60 hover:text-primary text-sm smooth-transition"
                data-testid="link-terms"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
