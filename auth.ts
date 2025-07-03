// import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { prisma } from "@/db/prisma"; // This will be the standard Node.js client
// // ... import your providers and other necessary utilities

// // Define your configuration in a plain object
// const authConfig = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     // Your CredentialsProvider, Google provider, etc. go here
//   ],
//   session: { strategy: "jwt" },
//   callbacks: {
//     // Your jwt and session callbacks go here
//   },
//   pages: {
//     signIn: "/sign-in",
//   },
// };

// // Pass the config object to the NextAuth factory
// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth(authConfig);

import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
// import { PrismaClient } from './lib/generated/prisma';
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

// const prisma = new PrismaClient();

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );
          if (isMatch) {
            // Return the user object on success
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // Return null if user not found or password doesn't match
        return null;
      },
    }),
  ],
  callbacks: {
    // The authorize callback runs first, then jwt, then session.
    async jwt({ token, user, trigger, session }: any) {
      // 1. On initial sign-in
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // If user has no name, create a default one from the email
        if (user.name === "NO_NAME") {
          const newName = user.email!.split("@")[0];
          token.name = newName;

          // Update the database with the new default name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: newName },
          });
        }

        // if (trigger === "signIn" || trigger === "signUp") {
        //   const cookiesObject = await cookies();
        //   const sessionCardId = cookiesObject.get("sessionCardId")?.value;
        //   console.log(sessionCardId);
        //   if (sessionCardId) {
        //     const sessionCard = await prisma.cart.findFirst({
        //       where: { sessionCartId },
        //     });

        //     if (sessionCard) {
        //       await prisma.cart.deleteMany({
        //         where: { userId: user.id },
        //       });

        //       await prisma.cart.update({
        //         where: { id: sessionCard.id },
        //         data: { userId: user.id },
        //       });
        //     }
        //   }
        // }
        // inside your jwt callback...
        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCard = await prisma.cart.findFirst({
              where: { sessionCartId: sessionCartId }, // Be explicit for clarity
            });

            if (sessionCard) {
              // Your existing logic to delete and update...
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              await prisma.cart.update({
                where: { id: sessionCard.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }

      // 2. When the session is updated (e.g., user updates their name)
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }

      if (session?.user?.name && trigger === "update") {
        token.name = session.user.name;
      }

      return token; // This was the misplaced return statement
    },
    async session({ session, token }: any) {
      // This token comes from the jwt callback above
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name;
      }
      return session;
    },

    authorized({ request, auth }: any) {
      //Array of regex patterns of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      //Get pathname from the req URL object
      const { pathname } = request.nextUrl;

      //Check if user is not authenicated and accessing a protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      //Check for session cart cookie
      if (!request.cookies.get("sessionCartId")) {
        //Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();

        //Clone the req headers
        const newRequestHeaders = new Headers(request.headers);

        //Create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        //Set newly generated sessionCardId in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
