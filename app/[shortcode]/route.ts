import { pool } from "@/lib/db";

export async function GET(
  req: Request,
  context?: { params?: { shortcode?: string } }
) {
  try {
    const params = context?.params ?? {};
    let shortcode = params.shortcode;

    // fallback: extract from request URL if params not provided
    if (!shortcode) {
      try {
        const url = new URL(req.url);
        const parts = url.pathname.split("/").filter(Boolean);
        shortcode = parts[parts.length - 1];
        console.log("Fallback extracted shortcode:", shortcode);
      } catch (e) {
        console.log("Failed to parse URL for shortcode fallback", e);
      }
    }

    if (!shortcode) {
      console.log("No shortcode found. context.params:", context?.params);
      return new Response("Missing shortcode", { status: 400 });
    }

    const q = await pool.query(
      "SELECT id, shortcode, targeturl FROM links WHERE shortcode = $1 LIMIT 1",
      [shortcode]
    );

    if (q.rows.length === 0) {
      return new Response("Not found", { status: 404 });
    }

    const row = q.rows[0];
    const target = row.targeturl ?? row.targeturl ?? "/";

    // Best-effort update clicks and last_clicked
    try {
      await pool.query(
        "UPDATE links SET clicks = COALESCE(clicks, 0) + 1, last_clicked = now() WHERE id = $1",
        [row.id]
      );
    } catch (updErr) {
      console.error("Failed to update clicks for shortcode", shortcode, updErr);
    }

    return new Response(null, {
      status: 302,
      headers: { Location: target },
    });
  } catch (err) {
    console.error("Redirect error", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}