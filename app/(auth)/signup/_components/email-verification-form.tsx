import { cn } from "@/lib/utils";
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

export function EmailVerificationForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
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
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="verificationCode">인증번호</Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6}>
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
                  example@email.com으로 인증번호를 발송했습니다
                </p>
              </div>
              <Button type="submit" className="w-full">
                인증 확인
              </Button>
              <Button variant="outline" className="w-full">
                인증번호 재발송
              </Button>
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
