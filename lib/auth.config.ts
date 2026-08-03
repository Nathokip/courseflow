import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";

type AppUser = {
  id: string;
  studentId?: string;
  role?: string;
};

type AppToken = JWT & {
  id?: string;
  studentId?: string;
  role?: string;
};

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      const appToken = token as AppToken;
      if (user) {
        const appUser = user as AppUser;
        appToken.id = appUser.id;
        appToken.studentId = appUser.studentId;
        appToken.role = appUser.role ?? "student";
      }
      return token;
    },
    async session({ session, token }) {
      const appToken = token as AppToken;
      if (session.user) {
        const sessionUser = session.user as {
          id?: string;
          studentId?: string;
          role?: string;
        };
        sessionUser.id = appToken.id;
        sessionUser.studentId = appToken.studentId;
        sessionUser.role = appToken.role ?? "student";
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  providers: [],
} satisfies NextAuthConfig;
