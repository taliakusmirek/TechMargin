/* The following SQL commands were written into the Supabase DB SQL Editor interface to create a database for this project. */


CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  sub_category VARCHAR(100),
  current_unit_price DECIMAL(10, 2),
  current_stock DECIMAL(10, 2),
  cogs DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE price_history (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  price DECIMAL(10, 2),
  price_source VARCHAR(100),
  captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TYPE pr_status AS ENUM('Not Checked', 'Recently Checked');

CREATE TABLE price_checks (
  id SERIAL PRIMARY KEY,
  scheduled_time TIME NOT NULL,
  last_check TIMESTAMP,
  status pr_status DEFAULT 'Not Checked',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reccomendations (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  reccomended_price DECIMAL(10, 2),
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);