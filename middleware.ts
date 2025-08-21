import NextAuth from "next-auth";
// Import the named config object
import { authConfig } from "@/auth";

export default NextAuth(authConfig).auth;

export const config = {
  // Your matcher array is now correct and separate
  matcher: [
    "/shipping-address",
    "/payment-method",
    "/place-order",
    "/profile",
    "/user/:path*",
    "/admin/:path*",
  ],
};
