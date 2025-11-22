import { pool } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const code = params?.code;
    if (!code) return new Response(JSON.stringify({ error: "Missing code" }), { status: 400 });

    const q = await pool.query(
      "SELECT id, shortcode, targetutl, targeturl, clicks, last_clicked, created_at FROM links WHERE shortcode = $1 LIMIT 1",
      [code]
    );
    if (q.rows.length === 0) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });

    const row = q.rows[0];
    // normalize target field for clients
    const result = {
      ...row,
      targeturl: row.targeturl ?? row.targetutl ?? null,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET /api/links/[code] error", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const code = params?.code;
    if (!code) return new Response(JSON.stringify({ error: "Missing code" }), { status: 400 });

    const del = await pool.query("DELETE FROM links WHERE shortcode = $1 RETURNING *", [code]);
    if (del.rows.length === 0) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("DELETE /api/links/[code] error", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
