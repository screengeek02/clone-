import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const email = credentials.email as string | undefined;

        if (!email) return null;

        return {
          id: "temp-user",
          email: email,
          name: "Research User",
        };
      }
    })
  ],

  pages: {
    signIn: "/login"
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role ?? "RESEARCHER";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role ?? "RESEARCHER";
      }
      return session;
    }
  }
};
