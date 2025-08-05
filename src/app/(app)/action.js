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
      // Gunakan data 'song' dan 'cover' yang asli
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
