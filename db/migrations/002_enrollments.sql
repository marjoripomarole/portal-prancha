CREATE TABLE IF NOT EXISTS enrollments (
  user_id text NOT NULL REFERENCES members(user_id) ON DELETE CASCADE,
  academic_term text NOT NULL CHECK (academic_term ~ '^[0-9]{4}\.[12]$'),
  group_id text NOT NULL,
  joined_at double precision NOT NULL,
  PRIMARY KEY (user_id, academic_term)
);
CREATE INDEX IF NOT EXISTS enrollments_group ON enrollments(group_id);
