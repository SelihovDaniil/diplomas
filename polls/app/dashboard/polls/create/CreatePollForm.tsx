"use client";

import { User } from "next-auth";
import { createPoll } from "./action";
import { useActionState, useState } from "react";

const initialState = { error: "" };

const CreatePollForm = ({ userId }: { userId: User["id"] }) => {
  const [options, setOptions] = useState<string[]>([]);
  const [optionName, setOptionName] = useState("");
  const [state, formAction, pending] = useActionState(createPoll, initialState);

  const addOption: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!optionName) return;
    if (options.includes(optionName)) return;
    setOptions((prev) => [...prev, optionName]);
    setOptionName("");
  };

  const deleteOption = (name: string) => {
    setOptions((prev) => prev.filter((el) => el !== name));
  };

  return (
    <form
      action={formAction}
      className="flex gap-2 flex-col max-w-xl mx-auto p-4 shadow-lg"
    >
      <h3 className="text-2xl text-center">Создание опроса</h3>
      <input
        className="border border-slate-300 rounded p-2"
        placeholder="Название опроса"
        name="name"
      />
      <label className="flex flex-col gap-1">
        Время завершения опроса
        <input
          type="datetime-local"
          className="border border-slate-300 rounded p-2"
          placeholder="Наименование"
          name="endsAt"
          required
        />
      </label>
      <input name="userId" type="hidden" value={userId} />
      <div>
        Варианты:
        <ul className="flex flex-col gap-2 mt-1">
          {options.map((el) => (
            <li className="flex gap-1 items-center" key={el}>
              <input name="options" type="hidden" value={el} />
              <span>{el}</span>
              <button
                className="py-2 px-4 rounded transition cursor-pointer text-white bg-red-700 hover:bg-red-600 active:bg-red-500"
                onClick={() => deleteOption(el)}
              >
                Удалить
              </button>
            </li>
          ))}
          <li className="flex gap-2">
            <input
              value={optionName}
              onChange={(e) => setOptionName(e.target.value)}
              className="border border-slate-300 rounded p-2 w-full"
              placeholder="Название варианта"
            />
            <button
              onClick={addOption}
              className="py-2 px-4 rounded transition cursor-pointer text-white bg-green-700 hover:bg-green-600 active:bg-green-500"
            >
              Добавить
            </button>
          </li>
        </ul>
      </div>
      {state.error && (
        <p className="border border-red-500 text-red-500 px-4 py-2 bg-red-100">
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="py-2 px-4 rounded transition cursor-pointer text-white bg-amber-700 hover:bg-amber-600 active:bg-amber-500"
      >
        Создать
      </button>
    </form>
  );
};

export default CreatePollForm;
