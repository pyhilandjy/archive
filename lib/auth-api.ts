// lib/api.ts
import { fetcher } from "./fetcher";

export const login = async (email: string, password: string) => {
  return fetcher<{ token: string; user_id: string }>("/login", {
    method: "POST",
    body: { email, password },
  });
};

export const signup = async (email: string, password: string) => {
  return fetcher<{ token: string; user_id: string }>("/signup", {
    method: "POST",
    body: { email, password },
  });
};

export const verifyEmail = async (email: string) => {
  return fetcher<{ success: boolean }>("/verify/request", {
    method: "POST",
    body: { email },
  });
};
export const requestVerification = async (email: string, otp: string) => {
  return fetcher<{ success: boolean }>("/verify/confirm", {
    method: "POST",
    body: { email, otp },
  });
};

export const me = async () => {
  return fetcher<{ user_id: string; email: string }>("/me", {
    method: "GET",
  });
};
