import { useMutation } from "@tanstack/react-query";
import { verifyEmail, requestVerification, signup } from "@/lib/auth-api";

export interface EmailInput {
  email: string;
  mode: "signup" | "password-reset";
}

export function useVerficationEmailMutation() {
  return useMutation({
    mutationFn: ({ email, mode }: EmailInput) => verifyEmail(email, mode),
  });
}

export function useRequestVerificationMutation() {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp?: string }) =>
      requestVerification(email, otp ?? ""),
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signup(email, password),
  });
}
