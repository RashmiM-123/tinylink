
CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  shortcode VARCHAR(64) NOT NULL UNIQUE,
  targeturl TEXT NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  last_clicked TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Optional: a lightweight function to update clicks/last_clicked
-- and a simple trigger can be added later if you want atomic updates.

-- Example insert (for testing):
-- INSERT INTO links (shortcode, targeturl) VALUES ('abc123', 'https://example.com');

-- Example to check rows:
-- SELECT id, shortcode, targeturl, clicks, last_clicked, created_at FROM links ORDER BY created_at DESC;
