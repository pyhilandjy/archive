"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { extractErrorMessage } from "@/lib/extract-error-message";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useRequestVerificationMutation,
  useVerficationEmailMutation,
} from "@/hooks/use-signup-mutation";

export function EmailVerificationForm({
  email,
  onSuccess,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  email: string;
  onSuccess: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5분(300초)
  const [errorMessage, setErrorMessage] = useState("");
  const checkMutation = useRequestVerificationMutation();
  const verificationMutation = useVerficationEmailMutation();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await checkMutation.mutateAsync({ email, otp });
    if (response.success) {
      onSuccess();
    }
  };

  const handleResend = async () => {
    setErrorMessage("");

    try {
      const response = await verificationMutation.mutateAsync({ email });
      if (response.success) {
        setTimeLeft(300);
      }
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      setErrorMessage(message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">이메일 인증</CardTitle>
          <CardDescription>
            입력하신 이메일로 발송된 6자리 인증번호를 입력해주세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="verificationCode">인증번호</Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} onChange={(value) => setOtp(value)}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {email}으로 인증번호를 발송했습니다
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  인증번호 유효시간: {Math.floor(timeLeft / 60)}분{" "}
                  {timeLeft % 60}초
                </p>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={checkMutation.isPending}
              >
                {checkMutation.isPending ? "확인 중..." : "인증 확인"}
              </Button>
              <Button
                type="button"
                className="w-full"
                onClick={handleResend}
                disabled={verificationMutation.isPending}
              >
                {verificationMutation.isPending
                  ? "재발송 중..."
                  : "인증번호 재발송"}
              </Button>
              {errorMessage && (
                <p className="text-sm text-red-500 text-center">
                  {errorMessage}
                </p>
              )}
            </div>
            <div className="mt-4 text-center text-sm">
              다른 이메일을 사용하시겠습니까?{" "}
              <a href="#" className="underline underline-offset-4">
                이메일 변경
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
