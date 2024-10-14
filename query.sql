-- Header Links =======================================
CREATE TABLE IF NOT EXISTS headerLinks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(45),
    url VARCHAR(45) UNIQUE,
    category VARCHAR(45) 
);

