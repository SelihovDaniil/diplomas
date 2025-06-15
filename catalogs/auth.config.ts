import type { NextAuthConfig } from "next-auth";
import Yandex from "next-auth/providers/yandex";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./lib/db";

export default {
  providers: [Yandex],
  adapter: MongoDBAdapter(() => client.connect()),
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
