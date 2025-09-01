import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User, SignUpData, SignInData } from "@shared/schema";

export function useEmailAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/email/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpData) => {
      return apiRequest("/api/auth/email/signup", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/email/user"] });
    },
  });

  const signInMutation = useMutation({
    mutationFn: async (data: SignInData) => {
      return apiRequest("/api/auth/email/signin", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/email/user"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/auth/email/logout", "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/email/user"] });
      queryClient.setQueryData(["/api/auth/email/user"], null);
    },
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user && !error,
    signUp: signUpMutation.mutateAsync,
    signIn: signInMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isSignUpLoading: signUpMutation.isPending,
    isSignInLoading: signInMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    signUpError: signUpMutation.error,
    signInError: signInMutation.error,
  };
}