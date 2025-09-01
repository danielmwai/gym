import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import Shop from "@/pages/shop";
import Membership from "@/pages/membership";
import Classes from "@/pages/classes";
import Checkout from "@/pages/checkout";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/shop" component={Shop} />
          <Route path="/membership" component={Membership} />
          <Route path="/classes" component={Classes} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/membership" component={Membership} />
          <Route path="/classes" component={Classes} />
          <Route path="/checkout" component={Checkout} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
