"use client";

import React, { useEffect, useState } from "react";

type LinkRow = {
    id?: number;
    shortcode?: string;
    targeturl?: string;
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

       const createUrl=async()=>{
       const result=await fetch("/api/links",{
         method: "POST",
           headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targeturl: longUrl.trim() }) // server accepts targeturl or targeturl
    });
       const data=await result.json();
       console.log("data",data)
         if (data.ok) {
    // Add the new row to your table
    setLinks(prev => [data.row, ...prev]);
         }
         setLongUrl("")
  
    }

 

    return (
        <div style={{ padding: 24 }}>
            <h1 style={{display:"flex",justifyContent:'center'}}>URL Shortener — tinylink</h1>

            <section style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6 }}>Long URL</label>
                <div style={{display:"flex",gap:"10px"}}>
                <input
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    placeholder="https://example.com/very/long/path"
                    style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
                />
                <button onClick={createUrl}>Generate</button>
                </div>
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
                            <th style={{ textAlign: "center", borderBottom: "1px solid #ddd", padding: 8 }}>Short URL</th>
                            <th style={{ textAlign: "center", borderBottom: "1px solid #ddd", padding: 8 }}>Target URL</th>
                            <th style={{ textAlign: "center", borderBottom: "1px solid #ddd", padding: 8 }}>Total Clicks</th>
                            <th style={{ textAlign: "center", borderBottom: "1px solid #ddd", padding: 8 }}>Last Clicked</th>
                            <th style={{ textAlign: "center", borderBottom: "1px solid #ddd", padding: 8 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {links.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: 12 }}>
                                    {loading ? "Loading links..." : "No links found."}
                                </td>
                            </tr>
                        )} */}

                        {links.map((l, idx) => (
                            <tr key={l.shortcode ?? l.id ?? idx}>
                                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" ,textAlign:"center"}}>
                                    {l.shortcode ? (
                                        <a href={`/${l.shortcode}`} target="_blank" rel="noreferrer">{`${location.origin}/${l.shortcode}`}</a>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" ,textAlign:"center"}}>{l.targeturl}</td>
                                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0",textAlign:"center"}}>{l.clicks}</td>
                                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0",textAlign:"center" }}>
                                    {l.last_clicked }
                                </td>
                                <td style={{display:"flex" ,gap:"20px",margin:"20px",textAlign:"center"}}>
                                    <button>Delete</button>
                                    <button>Edit</button>
                                    <button>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}