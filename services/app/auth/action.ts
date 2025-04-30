"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export const credentialsSignIn = async (prevState: any, formData: FormData) => {
  try {
    return await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: "Неверный пароль",
      };
    }
    throw error;
  }
};
