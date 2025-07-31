CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    slug TEXT UNIQUE NOT NULL,
    original TEXT NOT NULL,
    clicks INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    active_from TIMESTAMP,
    password TEXT,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE click_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID REFERENCES links(id) ON DELETE CASCADE,
    timestamp TIMESTAMP DEFAULT NOW(),
    ip TEXT,
    country TEXT,
    device TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION
);
