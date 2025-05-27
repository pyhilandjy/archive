import { SignUpForm } from "./_components/signup-form";
import { EmailVerificationForm } from "./_components/email-verification-form";
import { PasswordSetupForm } from "./_components/password-setup-form";

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* 화면 확인하기위해 모두 표시 */}
        <div className="space-y-8">
          <SignUpForm />
          <EmailVerificationForm />
          <PasswordSetupForm />
        </div>
      </div>
    </div>
  );
}
