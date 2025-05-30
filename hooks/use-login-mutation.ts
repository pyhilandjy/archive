// lib/useLoginMutation.ts
import { useMutation } from "@tanstack/react-query";
import { login, me } from "@/lib/auth-api";

type LoginInput = {
  email: string;
  password: string;
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: ({ email, password }: LoginInput) => login(email, password),

    // 선택: 성공 시 작업 (예: 토큰 저장, 리디렉션)
    onSuccess: (data) => {
      console.log("Login success:", data);
      // localStorage.setItem('token', data.token);
      // router.push('/dashboard');
    },

    // 선택: 에러 핸들링
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
}

export function useTestMe() {
  return useMutation({
    mutationFn: () => me(),

    // 선택: 성공 시 작업 (예: 사용자 정보 저장)
    onSuccess: (data) => {
      console.log("User data fetched:", data);
      // localStorage.setItem('user', JSON.stringify(data));
    },

    // 선택: 에러 핸들링
    onError: (error) => {
      console.error("Failed to fetch user data:", error);
    },
  });
}
