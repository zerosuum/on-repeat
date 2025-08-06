import React from "react";
import { getRepeatById } from "@/app/(app)/action";
import { EditForm } from "./EditForm";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
export default async function EditRepeatPage({ params }) {
  const { id } = await params;
  const repeat = await getRepeatById(id);

  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;

  if (!repeat || repeat.author !== username) {
    return redirect("/");
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Repeat</h1>
      <EditForm repeatData={repeat} />
    </div>
  );
}
