"use client";

import { useState } from "react";
import Link from "next/link";
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
import { useVerficationEmailMutation } from "@/hooks/use-signup-mutation";

export function SignUpForm({
  setEmail,
  onSuccess,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  setEmail: (email: string) => void;
  onSuccess: () => void;
}) {
  const [localEmail, setLocalEmail] = useState("");
  const mutation = useVerficationEmailMutation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await mutation.mutateAsync({ email: localEmail });
    if (response.success) {
      setEmail(localEmail); // 부모 컴포넌트로 이메일 전달
      onSuccess(); // 성공 시 단계 전환
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">회원가입</CardTitle>
          <CardDescription>
            계정을 생성하려면 이메일을 입력해주세요
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
              <Button type="submit" className="w-full">
                인증 이메일 발송
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="underline underline-offset-4">
                로그인
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
