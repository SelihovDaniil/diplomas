import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import * as v from "valibot";

const Home = async ({
  params,
  searchParams,
}: {
  params: Promise<{}>;
  searchParams: Promise<{ query: string }>;
}) => {
  const { query } = await searchParams;
  const services = await prisma.service.findMany({
    where: { name: { search: query } },
  });

  return (
    <div>
      <form
        action={async (formData: FormData) => {
          "use server";
          const QuerySchema = v.string();
          const query = v.parse(QuerySchema, formData.get("query"));
          if (!query) return redirect("/");
          return redirect("/?query=" + query);
        }}
        className="flex gap-2"
      >
        <input
          type="search"
          name="query"
          placeholder="Поиск..."
          defaultValue={query}
          className="border border-slate-400 rounded p-2 w-full"
        />
        <button className="bg-teal-700 text-white hover:bg-teal-600 active:bg-teal-500 px-4 py-2 rounded cursor-pointer">
          Найти
        </button>
      </form>
      <div className="flex flex-col gap-4 mt-4">
        {services.map((el) => (
          <Link
            key={el.id}
            href={"/services/" + el.id}
            className="p-2 shadow hover:bg-teal-100 active:bg-teal-200 transition"
          >
            <h5 className="text-xl text-center">{el.name}</h5>
            <div key={el.id} className="h-86 w-full relative mt-2">
              {el.image && (
                <Image
                  src={"/api/images/" + el.image}
                  alt={el.name}
                  fill
                  style={{
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
