import { pool } from "@/lib/db";

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
