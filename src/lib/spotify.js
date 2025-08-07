"use server";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const SEARCH_ENDPOINT = `https://api.spotify.com/v1/search`;

async function getAccessToken() {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store", 
  });

  if (!response.ok) {
    console.error("Spotify Auth Error:", await response.text());
    throw new Error("Failed to fetch access token from Spotify.");
  }

  const data = await response.json();
  return data.access_token;
}

export async function searchSongs(query) {
  if (!query) {
    return { success: true, data: [] };
  }

  try {
    const accessToken = await getAccessToken();
    const searchUrl = `${SEARCH_ENDPOINT}?q=${encodeURIComponent(
      query
    )}&type=track&limit=10`;

    const response = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Spotify Search Error:", await response.text());
      return { success: false, error: "Failed to search songs on Spotify." };
    }

    const data = await response.json();
    const items = data.tracks?.items || [];

    const mappedResults = items.map((item) => ({
      id: item.id,
      title: item.name,
      artist: item.artists.map((artist) => artist.name).join(", "),
      coverUrl:
        item.album.images?.[0]?.url || "https://i.imgur.com/3Y1q4k5.png",
      previewUrl: item.preview_url || null, 
    }));

    return { success: true, data: mappedResults };
  } catch (error) {
    console.error("Internal Search Error:", error.message);
    return { success: false, error: "An internal error occurred." };
  }
}
