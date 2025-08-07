import { NextResponse } from "next/server";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export async function GET() {
  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Spotify token");
    }

    const data = await response.json();
    return NextResponse.json({ accessToken: data.access_token });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
