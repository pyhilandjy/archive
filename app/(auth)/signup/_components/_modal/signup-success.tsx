import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function SignupSuccessModal({
  open,
  mode = "signup", // 기본값 설정
}: {
  open: boolean;
  mode?: "signup" | "password-reset";
}) {
  const router = useRouter();

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [open, router]);

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sr-only">
            {mode === "signup" ? "회원가입 완료" : "비밀번호 재설정 완료"}
          </DialogTitle>
          <DialogDescription className="text-center text-lg font-semibold py-8">
            {mode === "signup"
              ? "🎉 회원가입이 완료되었습니다!"
              : "🔑 비밀번호 재설정이 완료되었습니다!"}
          </DialogDescription>
        </DialogHeader>
        <DialogClose
          onClick={() => {
            router.push("/login");
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
