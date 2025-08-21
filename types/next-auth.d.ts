// FILE: types/next-auth.d.ts

// This imports the default types from the library
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// Here, we are "augmenting" or "extending" the original library types
declare module "next-auth/jwt" {
  // We are telling TypeScript that our JWT will also have these properties
  interface JWT extends DefaultJWT {
    id: string; // Add the 'id' property
    role: string;
  }
}

declare module "next-auth" {
  // We are telling TypeScript that our Session will also have these properties
  interface Session {
    user: {
      id: string; // Add the 'id' property
      role: string;
    } & DefaultSession["user"]; // This keeps the default properties like name, email, image
  }

  // We are telling TypeScript that our User object will also have these properties
  interface User extends DefaultUser {
    role: string;
    // This is the custom property that was causing the error
    rememberMe?: boolean;
  }
}
