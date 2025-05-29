"use client";
import { useState } from "react";
import { SignUpForm } from "./_components/signup-form";
import { EmailVerificationForm } from "./_components/email-verification-form";
import { PasswordSetupForm } from "./_components/password-setup-form";

export default function SignUpPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="space-y-8">
          <SignUpForm setEmail={setEmail} />
          <EmailVerificationForm email={email} />
          <PasswordSetupForm />
        </div>
      </div>
    </div>
  );
}
