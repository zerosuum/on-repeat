"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { searchSongs as searchSongsFromSpotify } from "@/lib/spotify";

const API_URL = "https://v1.appbackend.io/v1/rows/aj3vz68G55TG";

export async function createRepeatAction(prevState, formData) {
  const message = formData.get("message");
  const song = formData.get("song");
  const cover = formData.get("cover");

  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;

  if (!username) {
    return { error: "You must be logged in to post." };
  }
  if (!song || !cover) {
    return { error: "You must select a song." };
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ message, song, cover, author: username }]),
    });

    if (!response.ok) {
      throw new Error(errorData.message || "Failed to share your repeat.");
    }

    revalidatePath("/");

    return {
      message: "Successfully shared!",
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function searchSongsAction(query) {
  const results = await searchSongsFromSpotify(query);
  return results;
}

export async function deleteRepeatAction(repeatId) {
  if (!repeatId) {
    return { error: "Repeat ID is missing." };
  }

  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;

  if (!username) {
    return { error: "You must be logged in." };
  }

  try {
    const repeatRes = await fetch(`${API_URL}/${repeatId}`);
    if (!repeatRes.ok) {
      throw new Error("Repeat not found.");
    }
    const repeatData = await repeatRes.json();

    if (repeatData.author !== username) {
      return { error: "You are not authorized to delete this repeat." };
    }

    const deleteRes = await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([repeatId]),
    });

    if (!deleteRes.ok) {
      throw new Error("Failed to delete repeat from the database.");
    }

    revalidatePath("/");
    return { message: "Repeat deleted successfully!" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred." };
  }
}
