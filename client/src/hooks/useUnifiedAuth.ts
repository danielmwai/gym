import { useAuth } from "./useAuth";
import { useEmailAuth } from "./useEmailAuth";

export function useUnifiedAuth() {
  const replitAuth = useAuth();
  const emailAuth = useEmailAuth();

  // Determine which authentication method is active
  const isReplitAuthenticated = replitAuth.isAuthenticated;
  const isEmailAuthenticated = emailAuth.isAuthenticated;
  const isAuthenticated = isReplitAuthenticated || isEmailAuthenticated;
  
  // Get the current user from either auth method
  const user = isReplitAuthenticated ? replitAuth.user : emailAuth.user;
  
  // Loading state - true if either auth method is loading
  const isLoading = replitAuth.isLoading || emailAuth.isLoading;

  // Auth provider type
  const authProvider = isReplitAuthenticated ? "replit" : isEmailAuthenticated ? "email" : null;

  // Logout function that works for both auth methods
  const logout = async () => {
    if (isReplitAuthenticated) {
      window.location.href = "/api/logout";
    } else if (isEmailAuthenticated) {
      await emailAuth.logout();
    }
  };

  return {
    // Authentication status
    isAuthenticated,
    isLoading,
    user,
    authProvider,
    
    // Replit specific
    isReplitAuthenticated,
    replitUser: replitAuth.user,
    
    // Email specific
    isEmailAuthenticated,
    emailUser: emailAuth.user,
    signIn: emailAuth.signIn,
    signUp: emailAuth.signUp,
    isSignInLoading: emailAuth.isSignInLoading,
    isSignUpLoading: emailAuth.isSignUpLoading,
    signInError: emailAuth.signInError,
    signUpError: emailAuth.signUpError,
    
    // Common actions
    logout,
  };
}