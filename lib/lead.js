/* Send a website lead to /api/lead (→ Zoho CRM). section: "site-visit" | "estimator" | "quote-modal".
   keepalive lets the request finish even if the visitor navigates away right after submitting. */
export default async function sendLead(section, { name, phone, place, ...details }) {
  try {
    const res = await fetch("/api/lead/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, name, phone, place, details }),
      keepalive: true,
    });
    return res.ok;
  } catch (err) {
    console.error("lead send failed", err);
    return false;
  }
}
