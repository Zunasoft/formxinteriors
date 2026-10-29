import { NextResponse } from "next/server";

/* Website leads → Zoho CRM Leads module.
   Each form posts { section, name, phone, place, details } here; the section picks the
   Zoho tag so leads can be filtered by where they came from. Credentials stay on the server. */

const TAGS = {
  "site-visit": "Website - Site Visit",
  estimator: "Website - Estimator",
  "quote-modal": "Website - Quote Modal",
};

const ACCOUNTS = process.env.ZOHO_ACCOUNTS_URL || "https://accounts.zoho.in";
const API = process.env.ZOHO_API_URL || "https://www.zohoapis.in";

// access tokens last an hour; reuse one until shortly before it expires
let cached = { token: null, until: 0 };

async function accessToken() {
  if (cached.token && Date.now() < cached.until) return cached.token;
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    refresh_token: process.env.ZOHO_REFRESH_TOKEN,
  });
  const res = await fetch(`${ACCOUNTS}/oauth/v2/token`, { method: "POST", body, cache: "no-store" });
  const j = await res.json();
  if (!j.access_token) throw new Error(`Zoho token refresh failed: ${j.error || res.status}`);
  cached = { token: j.access_token, until: Date.now() + ((j.expires_in || 3600) - 300) * 1000 };
  return cached.token;
}

const clean = (v, max = 200) => String(v ?? "").trim().slice(0, max);

export async function POST(req) {
  if (!process.env.ZOHO_REFRESH_TOKEN) {
    return NextResponse.json({ error: "Zoho not configured" }, { status: 503 });
  }

  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const tag = TAGS[data.section];
  const name = clean(data.name, 80);
  const phone = clean(data.phone).replace(/\D/g, "").slice(-10);
  if (!tag || name.length < 2 || phone.length !== 10) {
    return NextResponse.json({ error: "Invalid lead" }, { status: 400 });
  }

  const place = clean(data.place);
  const details = Object.entries(data.details || {})
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${clean(k, 40)}: ${Array.isArray(v) ? v.map((x) => clean(x)).join(", ") : clean(v, 500)}`);

  // Zoho requires Last_Name; split "Rajesh Kumar" → First "Rajesh", Last "Kumar"
  const parts = name.split(/\s+/);
  const record = {
    First_Name: parts.length > 1 ? parts.slice(0, -1).join(" ") : undefined,
    Last_Name: parts.length > 1 ? parts.at(-1) : parts[0],
    Mobile: `+91${phone}`,
    City: place || undefined,
    Description: [`Form: ${tag}`, place && `Location: ${place}`, ...details].filter(Boolean).join("\n"),
    Tag: [{ name: tag }],
  };

  try {
    const res = await fetch(`${API}/crm/v8/Leads`, {
      method: "POST",
      headers: { Authorization: `Zoho-oauthtoken ${await accessToken()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ data: [record] }),
      cache: "no-store",
    });
    const j = await res.json();
    const row = j.data?.[0];
    if (row?.status !== "success") throw new Error(`Zoho insert failed: ${JSON.stringify(j)}`);
    return NextResponse.json({ ok: true, id: row.details?.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "CRM error" }, { status: 502 });
  }
}
