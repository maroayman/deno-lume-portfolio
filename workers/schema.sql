-- D1 Database Schema for View Counter
-- Run this to create the table:

CREATE TABLE IF NOT EXISTS views (
  path TEXT PRIMARY KEY,
  views INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- To deploy:
-- 1. Create D1 database: wrangler d1 create portfolio-views
-- 2. Update database_id in wrangler.toml
-- 3. Run migrations: wrangler d1 execute portfolio-views --local --file=./schema.sql
-- 4. Deploy worker: wrangler deploy
