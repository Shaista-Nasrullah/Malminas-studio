// app/(auth)/forgot-password/forgot-password-form.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import { requestPasswordReset } from "@/lib/actions/user.actions";
import { useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface ForgotPasswordFormProps {
  onEmailSubmitted: (email: string) => void;
}

const ForgotPasswordForm = ({ onEmailSubmitted }: ForgotPasswordFormProps) => {
  const [data, action] = useFormState(requestPasswordReset, {
    success: false,
    message: "",
    email: "",
  });
  const { pending } = useFormStatus();

  useEffect(() => {
    if (data.message) {
      if (data.success) {
        toast.success(data.message);
        if (data.email) {
          onEmailSubmitted(data.email);
        }
      } else {
        toast.error(data.message);
      }
    }
  }, [data, onEmailSubmitted]);

  return (
    <form action={action}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="your@example.com"
          />
        </div>
        <div>
          <Button
            disabled={pending}
            className="w-full"
            variant="default"
            type="submit"
          >
            {pending ? "Sending OTP..." : "Send OTP"}
          </Button>
        </div>
        {!data.success && data.message && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
        <div className="text-sm text-center text-muted-foreground">
          Remember your password?{" "}
          <Link href="/sign-in" className="link">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
