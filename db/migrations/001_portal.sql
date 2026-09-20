CREATE TABLE IF NOT EXISTS members (
  user_id text PRIMARY KEY,
  joined_at double precision NOT NULL
);
CREATE TABLE IF NOT EXISTS attempts (
  user_id text NOT NULL REFERENCES members(user_id) ON DELETE CASCADE,
  event_id text NOT NULL,
  item_id text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('read','hint','answer','reveal','rate')),
  correct integer CHECK (correct IN (0,1)),
  assisted integer NOT NULL CHECK (assisted IN (0,1)),
  rating integer CHECK (rating BETWEEN 0 AND 2),
  answer text,
  created_at double precision NOT NULL,
  PRIMARY KEY (user_id,event_id)
);
CREATE INDEX IF NOT EXISTS attempts_user_time ON attempts(user_id,created_at);
CREATE TABLE IF NOT EXISTS snapshots (
  user_id text NOT NULL REFERENCES members(user_id) ON DELETE CASCADE,
  book text NOT NULL,
  payload text NOT NULL,
  revision integer NOT NULL CHECK (revision > 0),
  updated_at double precision NOT NULL,
  PRIMARY KEY (user_id,book)
);
CREATE TABLE IF NOT EXISTS join_limits (
  user_id text NOT NULL,
  bucket bigint NOT NULL,
  count integer NOT NULL,
  PRIMARY KEY (user_id,bucket)
);
