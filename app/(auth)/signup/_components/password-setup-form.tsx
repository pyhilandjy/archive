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
import { resetPassword } from "@/lib/auth-api";
import SignupSuccessModal from "./_modal/signup-success";

export function PasswordSetupForm({
  email,
  mode = "signup",
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  email: string;
  mode?: "signup" | "password-reset";
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const signupMutation = useSignupMutation();

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError("");
    setValidationError("");
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setError("");
    setValidationError("");
  };

  const validatePasswords = (): string => {
    if (!password || !confirmPassword) {
      return "비밀번호와 비밀번호 확인을 모두 입력해주세요.";
    } else if (password !== confirmPassword) {
      return "비밀번호가 일치하지 않습니다.";
    }
    return "";
  };

  const isMinLengthValid = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validatePasswords();
    setError(validationError);

    if (!validationError) {
      if (mode === "signup") {
        // 회원가입 로직
        signupMutation.mutate(
          { email, password },
          {
            onSuccess: () => {
              setShowSuccessModal(true); // 회원가입 성공 모달 열기
            },
            onError: (error) => {
              if (error instanceof Error && error.message.includes("422")) {
                try {
                  const errorText = JSON.parse(error.message.split(": ")[1]);
                  const errorDetail =
                    errorText.detail?.[0]?.msg ||
                    "비밀번호 조건에 충족하지 못합니다.";
                  setValidationError(errorDetail);
                } catch {
                  setValidationError("비밀번호 조건에 충족하지 못합니다.");
                }
              }
            },
          }
        );
      } else if (mode === "password-reset") {
        // 비밀번호 재설정 로직
        try {
          const response = await resetPassword(email, password);
          if (response.success) {
            setShowSuccessModal(true); // 비밀번호 재설정 성공 모달 열기
          } else {
            setValidationError("비밀번호 재설정에 실패했습니다.");
          }
        } catch {
          setValidationError("비밀번호 재설정 중 오류가 발생했습니다.");
        }
      }
    }
  };

  return (
    <>
      <SignupSuccessModal open={showSuccessModal} />

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
                    onChange={(e) =>
                      handleConfirmPasswordChange(e.target.value)
                    }
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
                  {validationError && (
                    <p className="text-sm text-red-500 mt-2">
                      {validationError}
                    </p>
                  )}
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
    </>
  );
}
