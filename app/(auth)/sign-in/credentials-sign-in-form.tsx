"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom"; // Keep useFormState
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";
import { useState } from "react"; // Only useState needed

const CredentialsSignInForm = () => {
  const [data, action] = useFormState(signInWithCredentials, {
    success: false,
    message: "",
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [rememberMe, setRememberMe] = useState(true);

  // No useRouter or useEffect for redirection needed here.
  // The server action's `signIn` will handle the redirect directly.

  const SignInButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button
        disabled={pending} // Only disable based on pending state
        className="w-full"
        variant="default"
      >
        {pending ? "Signing In..." : "Sign In"}
      </Button>
    );
  };

  return (
    <form action={action}>
      {/* callbackUrl needs to be passed if your NextAuth config uses it for redirects */}
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <input type="hidden" name="rememberMe" value={String(rememberMe)} />
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            defaultValue={signInDefaultValues.password}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
          />
          <Label
            htmlFor="remember-me"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </Label>
        </div>
        <div>
          <SignInButton />
        </div>
        {/* Only show error message if success is false AND there's a message */}
        {!data.success && data.message && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
        <div className="text-sm text-center text-muted-foreground">
          Dont have an account?{" "}
          <Link href="/sign-up" target="_self" className="link">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
