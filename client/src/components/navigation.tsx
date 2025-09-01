import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user, logout, authProvider } = useUnifiedAuth();
  const { getItemCount, toggleCart } = useCart();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "#about", label: "About" },
    { href: "/classes", label: "Classes" },
    { href: "/membership", label: "Membership" },
    { href: "/shop", label: "Shop" },
    { href: "#contact", label: "Contact" },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-border" data-testid="navigation-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" data-testid="link-logo">
            <h1 className="text-2xl font-bold text-primary">FeminaFit</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-foreground hover:text-primary smooth-transition px-3 py-2 rounded-md text-sm font-medium"
                  data-testid={`link-nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Shopping Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCart}
              className="relative"
              data-testid="button-cart-toggle"
            >
              <ShoppingCart className="h-5 w-5" />
              {getItemCount() > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
                  data-testid="badge-cart-count"
                >
                  {getItemCount()}
                </Badge>
              )}
            </Button>

            {/* User Menu or Login */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-user-menu">
                    <User className="h-5 w-5 mr-2" />
                    {user?.firstName || user?.email?.split('@')[0] || 'Member'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/orders" data-testid="link-my-orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/membership" data-testid="link-my-membership">My Membership</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} data-testid="button-logout">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button asChild variant="outline" size="sm" data-testid="button-sign-in">
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button asChild size="sm" data-testid="button-sign-up">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCart}
              className="relative"
              data-testid="button-cart-toggle-mobile"
            >
              <ShoppingCart className="h-5 w-5" />
              {getItemCount() > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {getItemCount()}
                </Badge>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium smooth-transition"
                  data-testid={`link-mobile-nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-border">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      href="/orders"
                      className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                      data-testid="link-mobile-orders"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                      data-testid="button-mobile-logout"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/signin"
                      className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                      data-testid="link-mobile-signin"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground block px-3 py-2 rounded-md text-base font-medium text-center smooth-transition"
                      data-testid="link-mobile-signup"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
