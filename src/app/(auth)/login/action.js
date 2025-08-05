"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState, formData) {
  const username = formData.get("username");
  if (username) {
    const cookieStore = await cookies();
    cookieStore.set("username", username);
    redirect("/");
  }
  return null;
}