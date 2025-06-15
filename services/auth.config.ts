import type { NextAuthConfig } from "next-auth";
import Yandex from "next-auth/providers/yandex";

export default {
  providers: [Yandex],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
} satisfies NextAuthConfig;
