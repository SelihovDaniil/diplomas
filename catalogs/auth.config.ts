import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as v from "valibot";
import bcrypt from "bcryptjs";
import client from "./lib/db";

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

        await client.connect();

        const user = await client
          .db("catalogs")
          .collection("users")
          .findOne({ email });

        if (!user) {
          const hashedPassword = await bcrypt.hash(password, 10);
          const { insertedId } = await client
            .db("catalogs")
            .collection("users")
            .insertOne({
              email,
              password: hashedPassword,
            });
          const createdUser = await client
            .db("catalogs")
            .collection("users")
            .findOne({ _id: insertedId });
          if (!createdUser) return null;
          await client.close();

          return { id: insertedId.toString(), email: createdUser.email };
        }

        await client.close();
        if (!(await bcrypt.compare(password, user.password))) {
          return null;
        }

        return { id: user._id.toString(), email: user.email };
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
