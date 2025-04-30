import { auth, signOut } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await auth();

  if (!session?.user) return redirect("/auth");

  return (
    <div>
      <div className="flex gap-2 items-center">
        <p>
          Вы вошли как <b>{session.user.email}</b>
        </p>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button className="bg-teal-700 text-white hover:bg-teal-600 active:bg-teal-500 px-4 py-2 rounded cursor-pointer">
            Выйти
          </button>
        </form>
      </div>
      <div className="flex gap-4 flex-wrap mt-4">
        <Link href="/dashboard/services">
          <div className="bg-teal-200 hover:bg-teal-300 active:bg-teal-400 rounded shadow p-8 transition">
            Мои Услуги
          </div>
        </Link>
        <Link href="/dashboard/orders">
          <div className="bg-teal-200 hover:bg-teal-300 active:bg-teal-400 rounded shadow p-8 transition">
            Мои Заказы
          </div>
        </Link>
        <Link href="/dashboard/offers">
          <div className="bg-teal-200 hover:bg-teal-300 active:bg-teal-400 rounded shadow p-8 transition">
            Заказы клиентов
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
