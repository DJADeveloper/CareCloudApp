"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

// Lazy load the forms
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ResidentForm = dynamic(() => import("./forms/ResidentForm"), {
  loading: () => <h1>Loading...</h1>,
});

// Form mapping
const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  resident: (type, data) => <ResidentForm type={type} data={data} />,
};

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table: "teacher" | "resident" | "family" | "class" | "event" | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  const [open, setOpen] = useState(false);

  // Determine size and color dynamically
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  // Render appropriate form or message
  const Form = () => {
    if (type === "delete" && id) {
      return (
        <form action="" className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            Are you sure you want to delete this {table}? This action cannot be
            undone.
          </span>
          <button
            type="button"
            className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
            onClick={() => {
              console.log(`Deleting ${table} with ID: ${id}`);
              setOpen(false);
            }}
          >
            Confirm Delete
          </button>
        </form>
      );
    }

    if (type === "create" || type === "update") {
      const formComponent = forms[table];
      if (formComponent) {
        return formComponent(type, data);
      }
      return <p>Form for {table} not found!</p>;
    }

    return <p>Invalid action type: {type}</p>;
  };

  return (
    <>
      {/* Trigger button */}
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt={type} width={16} height={16} />
      </button>

      {/* Modal */}
      {open && (
        <div className="w-screen h-screen fixed left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="Close" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
