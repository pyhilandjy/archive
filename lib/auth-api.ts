// lib/api.ts
import { fetcher } from "./fetcher";

export const login = async (email: string, password: string) => {
  return await fetcher<{ token: string; user_id: string }>("/login", {
    method: "POST",
    body: { email, password },
  });
};

export const signup = async (email: string, password: string) => {
  return await fetcher<{ token: string; user_id: string }>("/signup", {
    method: "POST",
    body: { email, password },
  });
};

export const verifyEmail = async (email: string) => {
  return await fetcher<{ success: boolean }>("/verify/request", {
    method: "POST",
    body: { email },
  });
};
export const requestVerification = async (email: string, otp: string) => {
  return await fetcher<{ success: boolean }>("/verify/confirm", {
    method: "POST",
    body: { email, otp },
  });
};

export const me = async () => {
  return await fetcher("/me", {
    method: "GET",
  });
};

export const logout = async () => {
  return await fetcher("/logout", {
    method: "POST",
  });
};

export const checkEmailExists = async (email: string) => {
  const result = await fetcher<{ exists: boolean }[]>(
    `/email-exists/${email}`,
    {
      method: "GET",
    }
  );
  return result[0]; // 배열의 첫 번째 요소 반환
};

export const resetPassword = async (email: string, newPassword: string) => {
  return fetcher<{ success: boolean }>("/reset-password", {
    method: "POST",
    body: { email, newPassword },
  });
};
