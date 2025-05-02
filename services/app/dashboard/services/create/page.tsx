import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createService } from "./action";

const Create = async () => {
  const session = await auth();

  if (!session?.user) return redirect("/auth");

  return (
    <form
      action={createService}
      className="flex gap-2 flex-col max-w-xl mx-auto p-4 shadow-lg"
    >
      <h3 className="text-2xl text-center">Создание услуги</h3>
      <input
        className="border border-slate-300 rounded p-2"
        placeholder="Наименование"
        name="name"
      />
      <textarea
        className="border border-slate-300 rounded p-2"
        placeholder="Описание"
        name="description"
      ></textarea>
      <label className="flex gap-2 items-center">
        Изображение:
        <input
          className="border border-slate-300 hover:border-slate-400 rounded p-2 cursor-pointer transition"
          type="file"
          name="image"
        />
      </label>
      <button className="py-2 px-4 rounded transition cursor-pointer text-white bg-teal-700 hover:bg-teal-600 active:bg-teal-500">
        Создать
      </button>
    </form>
  );
};

export default Create;
