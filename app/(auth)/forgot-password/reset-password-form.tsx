// app/(auth)/forgot-password/reset-password-form.tsx (Moved and modified)
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import { resetUserPassword } from "@/lib/actions/user.actions";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ResetPasswordFormProps {
  email: string; // Now receives email directly
}

const ResetPasswordForm = ({ email }: ResetPasswordFormProps) => {
  const router = useRouter();
  const [data, action] = useFormState(resetUserPassword, {
    success: false,
    message: "",
  });
  const { pending } = useFormStatus();
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  useEffect(() => {
    if (data.message) {
      if (data.success) {
        toast.success(data.message);
        setPasswordResetSuccess(true);
        // Optionally redirect after a short delay
        setTimeout(() => {
          router.push("/sign-in");
        }, 3000);
      } else {
        toast.error(data.message);
      }
    }
  }, [data, router]);

  if (passwordResetSuccess) {
    return (
      <div className="text-center p-4">
        <p className="text-green-600 mb-4">
          Your password has been successfully reset. You will be redirected to
          the sign-in page shortly.
        </p>
        <Link href="/sign-in" className="link">
          Return to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="email" value={email} />
      <div className="space-y-4">
        <p className="text-center text-lg font-semibold">
          Set Your New Password
        </p>
        <div>
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Enter your new password"
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Confirm your new password"
          />
        </div>
        <div>
          <Button
            disabled={pending}
            className="w-full"
            variant="default"
            type="submit"
          >
            {pending ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
        {!data.success && data.message && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
      </div>
    </form>
  );
};

export default ResetPasswordForm;
