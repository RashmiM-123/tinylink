"use client";

import React, { useEffect, useState } from "react";

type LinkRow = {
    id?: number;
    shortcode?: string;
    targetutl?: string;
    clicks?: number | null;
    last_clicked?: string | null;
    created_at?: string | null;
    [key: string]: any;
};

export default function Dashboard() {
    const [longUrl, setLongUrl] = useState("");
    const [links, setLinks] = useState<LinkRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLinks();
    }, []);

    async function fetchLinks() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/links");
            if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
            const data = await res.json();
            setLinks(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error(err);
            setError("Could not load links");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: 24 }}>
            <h1>URL Shortener — Dashboard</h1>

            <section style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6 }}>Long URL</label>
                <input
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    placeholder="https://example.com/very/long/path"
                    style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
                />
            </section>

            <section style={{ marginBottom: 12 }}>
                <button onClick={fetchLinks} disabled={loading}>
                    {loading ? "Loading..." : "Refresh list"}
                </button>
                <span style={{ marginLeft: 12, color: "red" }}>{error}</span>
            </section>

            <section>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Short URL</th>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Target URL</th>
                            <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>Total Clicks</th>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Last Clicked</th>
                        </tr>
                    </thead>
                    <tbody>
                        {links.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: 12 }}>
                                    {loading ? "Loading links..." : "No links found."}
                                </td>
                            </tr>
                        )}

                        {links.map((l, idx) => (
                            <tr key={l.shortcode ?? l.id ?? idx}>
                                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                                    {l.shortcode ? (
                                        <a href={`/${l.shortcode}`} target="_blank" rel="noreferrer">{`${location.origin}/${l.shortcode}`}</a>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{l.targetutl ?? "-"}</td>
                                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0", textAlign: "right" }}>{l.clicks ?? 0}</td>
                                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                                    {l.last_clicked ? new Date(l.last_clicked).toLocaleString() : "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}