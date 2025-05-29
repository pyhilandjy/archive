"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignupMutation } from "@/hooks/use-signup-mutation";

export function PasswordSetupForm({
  email,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { email: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const signupMutation = useSignupMutation();

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError(""); // 상태 초기화
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setError(""); // 상태 초기화
  };

  const validatePasswords = (): string => {
    if (!password || !confirmPassword) {
      return "비밀번호와 비밀번호 확인을 모두 입력해주세요.";
    } else if (password !== confirmPassword) {
      return "비밀번호가 일치하지 않습니다.";
    }
    return ""; // 에러 없음
  };

  const isMinLengthValid = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validatePasswords(); // 즉시 검증 결과 확인
    setError(validationError); // 상태 업데이트
    if (!validationError) {
      signupMutation.mutate({ email, password });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">비밀번호 설정</CardTitle>
          <CardDescription>
            이메일 인증이 완료되었습니다. 회원가입을 완료하려면 비밀번호를
            설정해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
                {error && !password && (
                  <p className="text-sm text-red-500">
                    비밀번호를 입력해주세요.
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
                {error &&
                  password &&
                  confirmPassword &&
                  password !== confirmPassword && (
                    <p className="text-sm text-red-500">
                      비밀번호가 일치하지 않습니다.
                    </p>
                  )}
              </div>
              <div className="text-sm text-muted-foreground">
                <p>비밀번호 조건:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li className="flex items-center">
                    <input
                      type="checkbox"
                      readOnly
                      checked={isMinLengthValid}
                      className="mr-2"
                    />
                    최소 8자 이상
                  </li>
                  <li className="flex items-center">
                    <input
                      type="checkbox"
                      readOnly
                      checked={hasLowercase}
                      className="mr-2"
                    />
                    소문자 1개 이상
                  </li>
                  <li className="flex items-center">
                    <input
                      type="checkbox"
                      readOnly
                      checked={hasNumber}
                      className="mr-2"
                    />
                    숫자 1개 이상
                  </li>
                </ul>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={signupMutation.isPending}
              >
                회원가입 완료
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              다른 이메일을 사용하시겠습니까?{" "}
              <a href="#" className="underline underline-offset-4">
                처음부터 시작
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
