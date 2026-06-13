CREATE TABLE t_p96100472_wedding_invitation_s.guests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  drinks TEXT[],
  allergies TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);