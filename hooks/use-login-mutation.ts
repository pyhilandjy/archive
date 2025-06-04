// lib/useLoginMutation.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { login, me, logout } from "@/lib/auth-api";

type LoginInput = {
  email: string;
  password: string;
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: ({ email, password }: LoginInput) => login(email, password),
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
}

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: me,
    retry: false,
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: () => logout(),
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
}
