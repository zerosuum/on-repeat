"use server";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export async function getAccessToken() {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Spotify Auth Error:", errorText);
    throw new Error(`Failed to fetch access token. Status: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function searchSongs(query) {
  if (!query) return [];
  const accessToken = await getAccessToken();

  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    query
  )}&type=track&limit=5`;

  const response = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Spotify Search Error:", errorText);
    return [];
  }

  const data = await response.json();
  const items = data.tracks?.items;
  if (!items) return [];

  return items.map((item) => ({
    id: item.id,
    title: item.name,
    artist: item.artists.map((artist) => artist.name).join(", "),
    coverUrl: item.album.images?.[0]?.url,
  }));
}
