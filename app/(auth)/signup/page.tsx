"use client";
import { useState } from "react";
import { SignUpForm } from "./_components/signup-form";
import { EmailVerificationForm } from "./_components/email-verification-form";
import { PasswordSetupForm } from "./_components/password-setup-form";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 현재 단계 상태 추가

  const handleNextStep = () => setStep((prev) => prev + 1); // 단계 전환 함수

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="space-y-8">
          {step === 1 && (
            <SignUpForm setEmail={setEmail} onSuccess={handleNextStep} />
          )}
          {step === 2 && (
            <EmailVerificationForm email={email} onSuccess={handleNextStep} />
          )}
          {step === 3 && <PasswordSetupForm email={email} />}
        </div>
      </div>
    </div>
  );
}
