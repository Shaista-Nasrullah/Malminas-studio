// FILE: auth.ts

import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { NextResponse } from "next/server";
// We use the plain prisma client from db/prisma.ts for the adapter
import { prisma } from "@/db/prisma";

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
        rememberMe: { type: "boolean" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              rememberMe: credentials.rememberMe as boolean,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const rememberMe = user.rememberMe ?? false;
        if (!rememberMe) {
          const oneDayInSeconds = 24 * 60 * 60;
          token.exp = Math.floor(Date.now() / 1000) + oneDayInSeconds;
        }

        // --- THIS IS THE FINAL FIX ---
        // We provide a fallback `|| ""` to guarantee that token.id is always a string,
        // which satisfies the strict type we defined in types/next-auth.d.ts.
        token.id = user.id || "";
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name;
      }
      return session;
    },
    authorized({ request, auth }) {
      const protectedPaths = [/\/profile/, /\/user\/(.*)/, /\/admin/];
      const { pathname } = request.nextUrl;
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;
      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();
        const newRequestHeaders = new Headers(request.headers);
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
