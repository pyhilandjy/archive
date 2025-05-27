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

export function PasswordSetupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
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
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>비밀번호 조건:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>최소 8자 이상</li>
                  <li>대문자 1개 이상</li>
                  <li>소문자 1개 이상</li>
                  <li>숫자 1개 이상</li>
                </ul>
              </div>
              <Button type="submit" className="w-full">
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
