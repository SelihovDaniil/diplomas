import { auth, signIn } from "@/auth";
import Link from "next/link";

const Navigation = async () => {
  const session = await auth();

  return (
    <nav className="bg-amber-700 shadow p-4 flex justify-between items-center">
      <h3 className="text-2xl text-white">
        <Link href="/">Опросы</Link>
      </h3>
      {session?.user ? (
        <Link
          className="bg-white px-4 py-2 rounded-md hover:bg-amber-100 active:bg-amber-200 transition"
          href="/dashboard"
        >
          Аккаунт
        </Link>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("yandex", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="bg-white px-4 py-2 rounded-md hover:bg-amber-100 active:bg-amber-200 transition cursor-pointer"
          >
            Вход
          </button>
        </form>
      )}
    </nav>
  );
};

export default Navigation;
