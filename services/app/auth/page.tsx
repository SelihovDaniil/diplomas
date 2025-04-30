"use client";

import { useActionState } from "react";
import { credentialsSignIn } from "./action";

const initialState = {
  message: "",
};

const Auth = () => {
  const [state, formAction, pending] = useActionState(
    credentialsSignIn,
    initialState
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-2 my-32 mx-auto w-md shadow-lg p-4"
    >
      <h3 className="text-2xl text-center">Вход</h3>
      <input
        required
        type="email"
        name="email"
        placeholder="Email"
        className="border border-slate-300 rounded p-2"
      />
      <input
        required
        type="password"
        name="password"
        placeholder="Пароль"
        className="border border-slate-300 rounded p-2"
      />
      {state.message && (
        <div className="bg-red-100 border rounded p-2 border-rose-700 text-rose-700">
          {state.message}
        </div>
      )}
      <button
        disabled={pending}
        className={`py-2 px-4 rounded transition ${
          pending
            ? "bg-teal-200 text-teal-700"
            : "cursor-pointer text-white bg-teal-700 hover:bg-teal-600 active:bg-teal-500"
        }`}
      >
        Войти
      </button>
    </form>
  );
};

export default Auth;
