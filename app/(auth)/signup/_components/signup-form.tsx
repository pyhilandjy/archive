"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FetchError } from "@/lib/fetcher";
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
import { useVerficationEmailMutation } from "@/hooks/use-signup-mutation";
import { checkEmailExists } from "@/lib/auth-api";
import { extractErrorMessage } from "@/lib/extract-error-message";

export function SignUpForm({
  setEmail,
  onSuccess,
  mode = "signup",
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  setEmail: (email: string) => void;
  onSuccess: () => void;
  mode?: "signup" | "password-reset"; // 모드 추가
}) {
  const [localEmail, setLocalEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const verificationEmailMutation = useVerficationEmailMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("잠시만 기다려 주세요.");

    try {
      if (mode === "password-reset") {
        const response = await checkEmailExists(localEmail);
        console.log("Email existence check response:", response.exists);
        if (!response.exists) {
          setErrorMessage("존재하지 않는 이메일입니다.");
          return;
        }
      }

      // 이메일 인증 요청
      const response = await verificationEmailMutation.mutateAsync({
        email: localEmail,
        mode: mode,
      });

      if (response.success) {
        setEmail(localEmail);
        onSuccess();
      } else {
        setSuccessMessage("");
        setErrorMessage(
          mode === "signup"
            ? "이메일 인증 요청에 실패했습니다."
            : "비밀번호 재설정 요청에 실패했습니다."
        );
      }
    } catch (error: unknown) {
      setSuccessMessage("");

      if (
        error instanceof FetchError &&
        typeof error.body === "object" &&
        error.body !== null &&
        "detail" in error.body
      ) {
        const detail = (
          error.body as {
            detail:
              | Array<{
                  type?: string;
                  msg?: string;
                  ctx?: { reason?: string };
                }>
              | string;
          }
        ).detail;

        if (Array.isArray(detail)) {
          const first = detail[0];

          if (
            typeof first === "object" &&
            first !== null &&
            first.type === "value_error" &&
            first.msg?.includes("valid email address")
          ) {
            setErrorMessage("유효하지 않은 이메일입니다.");
            return;
          }

          if (typeof first.msg === "string") {
            setErrorMessage(first.msg);
            return;
          }
        }

        if (typeof detail === "string") {
          setErrorMessage(detail);
          return;
        }
      }

      // 그 외 에러는 fallback 메시지
      const message = extractErrorMessage(error);
      setErrorMessage(message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {mode === "signup" ? "회원가입" : "비밀번호 찾기"}
          </CardTitle>
          <CardDescription>
            {mode === "signup"
              ? "계정을 생성하려면 이메일을 입력해주세요"
              : "찾으실 비밀번호의 이메일을 입력해주세요"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  onChange={(e) => setLocalEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-500 text-sm">{successMessage}</p>
              )}
              <Button type="submit" className="w-full">
                인증 이메일 발송
              </Button>
            </div>
            {mode === "signup" && (
              <div className="mt-4 text-center text-sm">
                이미 계정이 있으신가요?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  로그인
                </Link>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
