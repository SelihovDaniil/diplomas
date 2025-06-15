import { auth, signIn } from "@/auth";
import Link from "next/link";

const Navigation = async () => {
  const session = await auth();

  return (
    <nav className="bg-teal-700 shadow p-4 m-2 rounded flex justify-between items-center">
      <h3 className="text-2xl text-white">
        <Link href="/">Поиск и бронирование услуг</Link>
      </h3>
      <ul>
        {session?.user ? (
          <li>
            <Link
              href="/dashboard"
              className="bg-white px-4 py-2 rounded-md hover:bg-teal-100 active:bg-teal-200 transition"
            >
              Аккаунт
            </Link>
          </li>
        ) : (
          <li>
            <form
              action={async () => {
                "use server";
                await signIn("yandex", { redirectTo: "/dashboard" });
              }}
            >
              <button
                className="bg-white px-4 py-2 rounded-md hover:bg-teal-100 active:bg-teal-200 transition"
                type="submit"
              >
                Вход
              </button>
            </form>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
