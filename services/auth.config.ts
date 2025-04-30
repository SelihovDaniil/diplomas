import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import * as v from "valibot";
import bcrypt from "bcryptjs";

export const CredentialsSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.string(),
});

export default {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { output, success } = await v.safeParse(
          CredentialsSchema,
          credentials
        );

        if (!success) return null;

        const { email, password } = output;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          const hashedPassword = await bcrypt.hash(password, 10);
          const createdUser = await prisma.user.create({
            data: { email, password: hashedPassword },
          });
          return createdUser;
        }

        if (!(await bcrypt.compare(password, user.password))) {
          return null;
        }

        return user;
      },
    }),
  ],
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
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
} satisfies NextAuthConfig;
