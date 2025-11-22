"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type LinkRow = {
  id?: number;
  shortcode?: string;
  targeturl?: string | null;
  clicks?: number | null;
  last_clicked?: string | null;
  created_at?: string | null;
  [key: string]: any;
};

export default function Page({ params }: { params: { code: string } }) {
  const { code } = params;
  const router = useRouter();
  const [link, setLink] = useState<LinkRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLink();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function fetchLink() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/links/${code}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Fetch failed: ${res.status}`);
      }
      const data = await res.json();
      setLink(data);
    } catch (err: any) {
      console.error(err);
      setError("Could not load link");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this link?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/links/${code}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      // navigate back to dashboard
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Could not delete link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ textAlign: "center" }}>Link Stats</h1>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && link && (
          <div>
            <p>
              <strong>Shortcode:</strong> {link.shortcode}
            </p>
            <p>
              <strong>Target URL:</strong>{" "}
              <a href={link.targeturl ?? "#"} target="_blank" rel="noreferrer">
                {link.targeturl}
              </a>
            </p>
            <p>
              <strong>Total Clicks:</strong> {link.clicks ?? 0}
            </p>
            <p>
              <strong>Last Clicked:</strong> {link.last_clicked ?? "-"}
            </p>
            <p>
              <strong>Created At:</strong> {link.created_at ?? "-"}
            </p>

            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <button onClick={() => router.push(`/`)}>Back</button>
              <button onClick={handleDelete} disabled={loading} style={{ background: "#e53e3e", color: "white" }}>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
