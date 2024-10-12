-- Header Links =======================================
CREATE TABLE IF NOT EXISTS headerLinks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(45),
    url VARCHAR(45) UNIQUE,
    category VARCHAR(45) 
);

-- Inserting data into the links ======================
INSERT INTO headerLinks (title, url, category)
VALUES
    ('Flight Status', '/flight_status', 'Travel'),
    ('Flight Information', '/flight_info', 'Travel'),
    ('Frequently Asked Questions', '/faqs', 'General'),
    ('About Us', '/about', 'General'),
    ('News Room', '/newsroom', 'News'),
    ('Parking & Transport', '/parking_transport', 'General'),
    ('Visit Monrovia', '/visit_monrovia', 'General')
