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

export default function SignupSuccessModal({ open }: { open: boolean }) {
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
          <DialogTitle className="sr-only">회원가입 완료</DialogTitle>
          <DialogDescription className="text-center text-lg font-semibold py-8">
            🎉 회원가입이 완료되었습니다!
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
