// app/(auth)/forgot-password/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ForgotPasswordStepper from "./forgot-password-stepper";

export const metadata: Metadata = {
  title: "Forgot Password",
};

const ForgotPasswordPage = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="m-auto">
            <Image
              src="/images/logo.png"
              alt={`${APP_NAME} logo`}
              height={110}
              width={130}
              priority={true}
            />
          </Link>
          <CardTitle className="text-center">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email to receive an OTP to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ForgotPasswordStepper />
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
