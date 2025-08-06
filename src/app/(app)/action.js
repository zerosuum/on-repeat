"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { searchSongs as searchSongsFromSpotify } from "@/lib/spotify";
import { redirect } from "next/navigation";

const API_URL = "https://v1.appbackend.io/v1/rows/aj3vz68G55TG";

// READ (ONE)
export async function getRepeatById(repeatId) {
  if (!repeatId) return null;
  try {
    const res = await fetch(`${API_URL}/${repeatId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to get repeat by ID:", error);
    return null;
  }
}

// CREATE
export async function createRepeatAction(prevState, formData) {
  const message = formData.get("message");
  const song = formData.get("song");
  const cover = formData.get("cover");
  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;

  if (!username || !song || !cover || !message) {
    return { error: "Missing required fields." };
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ message, song, cover, author: username }]),
    });
    if (!response.ok) throw new Error("Failed to share your repeat.");
    revalidatePath("/");
    return { message: "Successfully shared!" };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error." };
  }
}

// UPDATE
export async function updateRepeatAction(prevState, formData) {
  const id = formData.get("id");
  const message = formData.get("message");
  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;

  if (!id || !message || !username) {
    return { error: "Missing required fields." };
  }

  try {
    const repeatToUpdate = await getRepeatById(id);
    if (
      !repeatToUpdate ||
      repeatToUpdate.author.toLowerCase() !== username.toLowerCase()
    ) {
      return { error: "You are not authorized to edit this repeat." };
    }

    const response = await fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id, message }),
    });
    if (!response.ok) throw new Error("Failed to update repeat.");

    revalidatePath("/");
    redirect("/");
  } catch (error) {
    if (error.digest?.includes("NEXT_REDIRECT")) throw error;
    return { error: error instanceof Error ? error.message : "Unknown error." };
  }
}

// DELETE
export async function deleteRepeatAction(repeatId) {
  if (!repeatId) return { error: "Repeat ID is missing." };
  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;
  if (!username) return { error: "You must be logged in." };

  try {
    const repeatToDelete = await getRepeatById(repeatId);
    if (
      !repeatToDelete ||
      repeatToDelete.author.toLowerCase() !== username.toLowerCase()
    ) {
      return { error: "You are not authorized to delete this repeat." };
    }

    const deleteRes = await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([repeatId]),
    });
    if (!deleteRes.ok) throw new Error("Failed to delete repeat.");

    revalidatePath("/");
    return { message: "Repeat deleted successfully!" };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error." };
  }
}

// SEARCH (Spotify)
export async function searchSongsAction(query) {
  return await searchSongsFromSpotify(query);
}
