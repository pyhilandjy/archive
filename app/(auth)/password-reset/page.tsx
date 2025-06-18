"use client";
import { useState } from "react";
import { SignUpForm } from "../signup/_components/signup-form";
import { EmailVerificationForm } from "../signup/_components/email-verification-form";
import { PasswordSetupForm } from "../signup/_components/password-setup-form";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);

  const handleNextStep = () => setStep((prev) => prev + 1);
  // step3에서 이메일을 기준으로 비밀번호 재설정이 이루어져야함.
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="space-y-8">
          {step === 1 && (
            <SignUpForm
              setEmail={setEmail}
              onSuccess={handleNextStep}
              mode="password-reset"
            />
          )}
          {step === 2 && (
            <EmailVerificationForm
              email={email}
              onSuccess={handleNextStep}
              mode="password-reset"
            />
          )}
          {step === 3 && (
            <PasswordSetupForm email={email} mode="password-reset" />
          )}
        </div>
      </div>
    </div>
  );
}
