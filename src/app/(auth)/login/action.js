"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState, formData) {
  const username = formData.get("username");
  const callbackUrl = formData.get("callbackUrl");

  if (username) {
    await cookies().set("username", username);
    redirect(callbackUrl || "/");
  }

  return { error: "Please enter a username." };
}
