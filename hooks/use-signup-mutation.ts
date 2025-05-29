import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "@/lib/auth-api";

export interface EmailInput {
  email: string;
}

export function useVerficationEmailMutation() {
  return useMutation({
    mutationFn: ({ email }: EmailInput) => verifyEmail(email),
  });
}
