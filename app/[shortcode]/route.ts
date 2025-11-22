import { pool } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { shortcode: string } }
) {
  const { shortcode } = params;
  if (!shortcode) {
    return new Response("Missing shortcode", { status: 400 });
  }

  try {
    const q = await pool.query(
      "SELECT id, shortcode, targetutl, targeturl FROM links WHERE shortcode = $1 LIMIT 1",
      [shortcode]
    );

    if (q.rows.length === 0) {
      return new Response("Not found", { status: 404 });
    }

    const row = q.rows[0];
    const target = row.targetutl ?? row.targeturl ?? "/";

    // Update clicks and last_clicked (best-effort; separate query keeps logic simple)
    try {
      await pool.query(
        "UPDATE links SET clicks = COALESCE(clicks, 0) + 1, last_clicked = now() WHERE id = $1",
        [row.id]
      );
    } catch (updErr) {
      console.error("Failed to update clicks for shortcode", shortcode, updErr);
    }

    // Redirect to the target URL
    return new Response(null, {
      status: 307,
      headers: { Location: target },
    });
  } catch (err) {
    console.error("Redirect error for shortcode", shortcode, err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
