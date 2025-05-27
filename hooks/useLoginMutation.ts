// lib/useLoginMutation.ts
import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api";

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
