-- Create the users table
create table refresh (
    id bigserial primary key,
    token text not null,
    expiresat bigint not null,
    address text not null UNIQUE

);

-- Create the companies table
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  email TEXT,
  phone TEXT,
  telegram TEXT,
  owner TEXT,
  instagram TEXT
);

-- Create the categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL
);

-- Create the events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  contract_address TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  banner_hash TEXT DEFAULT '',
  location TEXT DEFAULT '',
  is_offline bool DEFAULT false,
  price FLOAT DEFAULT 0,
  category TEXT DEFAULT '',
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  is_notified bool DEFAULT false
);

-- Create the comments table
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  comment TEXT NOT NULL,
  publish_date TIMESTAMP NOT NULL,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  user_address TEXT,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE
);

-- Create the promocodes table
CREATE TABLE promocodes (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount INTEGER NOT NULL,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  initial_usages INTEGER NOT NULL,
  usages INTEGER NOT NULL,
  expire_date TIMESTAMP NOT NULL
);

-- Create the many-to-many relationship table between companies and users
CREATE TABLE user_company (
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_address TEXT NOT NULL,  
  role TEXT NOT NULL CHECK (role IN ('member', 'admin', 'owner')),
  PRIMARY KEY (company_id, user_address)
);
