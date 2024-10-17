-- Header Links =======================================
CREATE TABLE IF NOT EXISTS headerLinks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(45),
    url VARCHAR(45) UNIQUE,
    category VARCHAR(45) 
);

CREATE TABLE IF NOT EXISTS about (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    image BYTEA,
    content TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE about
ADD COLUMN IF NOT EXISTS photoType VARCHAR(50);

CREATE TABLE IF NOT EXISTS parking_tran (
    id SERIAL PRIMARY KEY,
    pt_label VARCHAR(255) NOT NULL,
    pt_content TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
