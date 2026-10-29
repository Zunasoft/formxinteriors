import { NextResponse } from "next/server";

/* Live Instagram feed for the Instagram section (Instagram API with Instagram Login).
   The token stays on the server; the browser only ever sees the trimmed JSON below.
   Cached for an hour so we stay well inside the API rate limits. */
export const revalidate = 3600;

const GRAPH = "https://graph.instagram.com/v21.0";
const MEDIA_FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count";

async function ig(path, params) {
  const qs = new URLSearchParams({ ...params, access_token: process.env.INSTAGRAM_ACCESS_TOKEN });
  const res = await fetch(`${GRAPH}${path}?${qs}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`Instagram ${path} ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function GET() {
  if (!process.env.INSTAGRAM_ACCESS_TOKEN) {
    return NextResponse.json({ error: "INSTAGRAM_ACCESS_TOKEN not set" }, { status: 503 });
  }
  try {
    const [profile, media] = await Promise.all([
      ig("/me", { fields: "username,media_count,followers_count" }),
      ig("/me/media", { fields: MEDIA_FIELDS, limit: "12" }),
    ]);
    const posts = (media.data || [])
      .map((m) => ({
        id: m.id,
        // videos/reels expose a still via thumbnail_url; images and carousels use media_url
        image: m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url,
        isVideo: m.media_type === "VIDEO",
        caption: m.caption || "",
        permalink: m.permalink,
        timestamp: m.timestamp,
        likes: m.like_count ?? null,
      }))
      .filter((p) => p.image)
      .slice(0, 8);
    return NextResponse.json({
      username: profile.username,
      mediaCount: profile.media_count ?? null,
      followers: profile.followers_count ?? null,
      posts,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Instagram fetch failed" }, { status: 502 });
  }
}
