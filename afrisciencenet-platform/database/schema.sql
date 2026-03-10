-- Afrisciencenet Platform Database Schema (PostgreSQL/SQLite compatible)

CREATE TABLE IF NOT EXISTS institutions (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(120) NOT NULL,
  city VARCHAR(120),
  research_field VARCHAR(180),
  description TEXT,
  website VARCHAR(255),
  contact_info VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS equipment (
  id INTEGER PRIMARY KEY,
  equipment_name VARCHAR(255) NOT NULL,
  manufacturer VARCHAR(255),
  model VARCHAR(255),
  institution_id INTEGER,
  country VARCHAR(120) NOT NULL,
  city VARCHAR(120),
  department VARCHAR(180),
  description TEXT,
  technical_specifications TEXT,
  availability_status VARCHAR(50) DEFAULT 'available',
  contact_information VARCHAR(255),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (institution_id) REFERENCES institutions(id)
);

CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  link VARCHAR(500),
  deadline DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forum_categories (
  id INTEGER PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS forum_posts (
  id INTEGER PRIMARY KEY,
  category_id INTEGER NOT NULL,
  author_name VARCHAR(120) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES forum_categories(id)
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'researcher',
  is_approved BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
