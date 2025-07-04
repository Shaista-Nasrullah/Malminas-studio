// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { signInDefaultValues } from "@/lib/constants";
// import Link from "next/link";
// import { useActionState } from "react";
// import { useFormStatus } from "react-dom";
// import { signInWithCredentials } from "@/lib/actions/user.actions";
// import { useSearchParams } from "next/navigation";

// const CredentialsSignInForm = () => {
//   const [data, action] = useActionState(signInWithCredentials, {
//     success: false,
//     message: "",
//   });

//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get("callbackUrl") || "/";

//   const SignInButton = () => {
//     const { pending } = useFormStatus();

//     return (
//       <Button disabled={pending} className="w-full" variant="default">
//         {pending ? "Signing In..." : "Sign In"}
//       </Button>
//     );
//   };

//   return (
//     <form action={action}>
//       <input type="hidden" name="callbackUrl" value={callbackUrl} />
//       <div className="space-y-6">
//         <div>
//           <Label htmlFor="email">Email</Label>
//           <Input
//             id="email"
//             name="email"
//             type="email"
//             required
//             autoComplete="email"
//             defaultValue={signInDefaultValues.email}
//           />
//         </div>
//         <div>
//           <Label htmlFor="password">Password</Label>
//           <Input
//             id="password"
//             name="password"
//             type="password"
//             required
//             autoComplete="password"
//             defaultValue={signInDefaultValues.password}
//           />
//         </div>
//         <div>
//           <SignInButton />
//         </div>

//         {data && !data.success && (
//           <div className="text-center text-destructive">{data.message}</div>
//         )}

//         <div className="text-sm text-center text-muted-foreground">
//           Don&apos;t have an account?{" "}
//           <Link href="/sign-up" target="_self" className="link">
//             Sign Up
//           </Link>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default CredentialsSignInForm;

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// HIGHLIGHT: Import the Checkbox component
import { Checkbox } from "@/components/ui/checkbox";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";
import { useState } from "react"; // Import useState for the checkbox

const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // HIGHLIGHT: Add state to control the checkbox
  const [rememberMe, setRememberMe] = useState(true);

  const SignInButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Signing In..." : "Sign In"}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      {/* 
        HIGHLIGHT: Add a hidden input to pass the rememberMe state to the server action.
        This is the standard way to handle non-input state in form actions.
      */}
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
            autoComplete="current-password" // More specific autocomplete
            defaultValue={signInDefaultValues.password}
          />
        </div>

        {/* HIGHLIGHT: The "Remember Me" checkbox */}
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

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" target="_self" className="link">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
