import { pool } from "@/lib/db";



export async function POST(req: Request) {
  try {
    const body = await req.json();
    // accept either property name if client sends targeturl 
    const target = (body.targeturl).toString().trim();
    if (!target) {
      return new Response(JSON.stringify({ error: "Missing target URL" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // simple shortcode generator (replace with nanoid if desired)
    const shortcode = Math.random().toString(36).slice(2, 8);

    // Insert into DB (adjust column name: schema uses targeturl)
    const insert = await pool.query(
      "INSERT INTO links (shortcode, targeturl) VALUES ($1, $2) RETURNING *",
      [shortcode, target]
    );

    return new Response(JSON.stringify({ ok: true, row: insert.rows[0] }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("POST /api/links error", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function GET() {
	try {
		const result = await pool.query(
			"SELECT * FROM links ORDER BY created_at DESC"
		);
		return new Response(JSON.stringify(result.rows), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("GET /api/links error", error);
		return new Response(JSON.stringify({ error: "Server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}

// You can add POST/PUT/DELETE handlers later as needed.
