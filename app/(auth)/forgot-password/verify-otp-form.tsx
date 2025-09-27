// app/(auth)/forgot-password/verify-otp-form.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import {
  verifyOtpForPasswordReset,
  requestPasswordReset,
} from "@/lib/actions/user.actions";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface VerifyOtpFormProps {
  email: string;
  onOtpVerified: (email: string) => void;
}

const VerifyOtpForm = ({ email, onOtpVerified }: VerifyOtpFormProps) => {
  const [data, action] = useFormState(verifyOtpForPasswordReset, {
    success: false,
    message: "",
  });
  const { pending } = useFormStatus();

  // State for resend OTP
  const [resendOtpState, resendOtpAction] = useFormState(requestPasswordReset, {
    success: false,
    message: "",
  });
  const [resendPending, setResendPending] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60 seconds

  useEffect(() => {
    if (data.message) {
      if (data.success) {
        toast.success(data.message);
        onOtpVerified(email);
      } else {
        toast.error(data.message);
      }
    }
  }, [data, email, onOtpVerified]);

  useEffect(() => {
    if (resendOtpState.message) {
      if (resendOtpState.success) {
        toast.success("New OTP sent to your email.");
        setCountdown(60); // Reset countdown
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setResendPending(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(resendOtpState.message);
      }
      setResendPending(false); // End resend loading state
    }
  }, [resendOtpState]);

  const handleResendOtp = async () => {
    setResendPending(true);
    // Manually create FormData for resend action
    const formData = new FormData();
    formData.append("email", email);
    await resendOtpAction(formData);
  };

  return (
    <form action={action}>
      <input type="hidden" name="email" value={email} />
      <div className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          An OTP has been sent to <span className="font-semibold">{email}</span>
          . Please enter it below.
        </p>
        <div>
          <Label htmlFor="otp">One-Time Password (OTP)</Label>
          <Input
            id="otp"
            name="otp"
            type="text"
            required
            pattern="\d{6}" // Ensures 6 digits
            maxLength={6}
            placeholder="Enter 6-digit OTP"
          />
        </div>
        <div>
          <Button
            disabled={pending}
            className="w-full"
            variant="default"
            type="submit"
          >
            {pending ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
        {!data.success && data.message && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
        <div className="text-sm text-center text-muted-foreground mt-4">
          Didn&apos;t receive the OTP?{" "}
          {countdown === 0 ? (
            <Button
              type="button"
              variant="link"
              onClick={handleResendOtp}
              disabled={resendPending}
              className="p-0 h-auto"
            >
              {resendPending ? "Sending..." : "Resend OTP"}
            </Button>
          ) : (
            <span className="font-semibold">Resend in {countdown}s</span>
          )}
        </div>
        <div className="text-sm text-center text-muted-foreground">
          <Link href="/sign-in" className="link">
            Return to Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default VerifyOtpForm;
