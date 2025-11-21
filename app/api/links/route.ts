import { pool } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const { target, customCode } = await req.json();

    if (!target) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    const code = customCode || nanoid(6);

    // Check if code exists
    const exists = await pool.query("SELECT code FROM links WHERE code=$1", [code]);
    if (exists.rows.length > 0) {
      return Response.json({ error: "Short code already exists" }, { status: 409 });
    }

    await pool.query(
      "INSERT INTO links (code, target) VALUES ($1, $2)",
      [code, target]
    );

    return Response.json({ ok: true, code });
  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
