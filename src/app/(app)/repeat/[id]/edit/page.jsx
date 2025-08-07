import React from "react";
import { getRepeatById } from "@/app/(app)/action";
import { EditForm } from "./EditForm";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function EditRepeatPage({ params }) {
  const { id } = params;
  const repeat = await getRepeatById(id);

  const cookieStore = cookies();
  const username = cookieStore.get("username")?.value;

  if (!repeat || repeat.author.toLowerCase() !== username?.toLowerCase()) {
    return redirect("/");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 py-8 px-4">
      <h1 className="text-2xl font-bold text-center">EDIT MISSION LOG</h1>
      <EditForm repeatData={repeat} />
    </div>
  );
}
