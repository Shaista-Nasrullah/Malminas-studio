// app/(auth)/forgot-password/forgot-password-stepper.tsx
"use client";

import { useState } from "react";
import ForgotPasswordForm from "./forgot-password-form";
import VerifyOtpForm from "./verify-otp-form";
import ResetPasswordForm from "./reset-password-form";

const ForgotPasswordStepper = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [userEmail, setUserEmail] = useState("");

  const handleEmailSubmitted = (email: string) => {
    setUserEmail(email);
    setStep("otp");
  };

  const handleOtpVerified = (email: string) => {
    setUserEmail(email);
    setStep("reset");
  };

  // After password reset, we'd typically redirect to sign-in
  // No need for a separate handler here as ResetPasswordForm will handle navigation.

  return (
    <div>
      {step === "email" && (
        <ForgotPasswordForm onEmailSubmitted={handleEmailSubmitted} />
      )}
      {step === "otp" && (
        <VerifyOtpForm email={userEmail} onOtpVerified={handleOtpVerified} />
      )}
      {step === "reset" && <ResetPasswordForm email={userEmail} />}
    </div>
  );
};

export default ForgotPasswordStepper;
