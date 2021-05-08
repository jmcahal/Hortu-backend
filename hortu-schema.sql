CREATE TABLE users (
    id SERIAL UNIQUE,
    username VARCHAR(15) PRIMARY KEY CHECK (username = lower(username)),
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
      CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE plants (
  id SERIAL PRIMARY KEY,
  common_name TEXT NOT NULL,
  sci_name TEXT NOT NULL,
  seed_specs TEXT,
  transplant TEXT,
  culture TEXT,
  germination TEXT,
  disease_pests TEXT,
  harvest TEXT,
  life_cycle TEXT,
  spacing TEXT,
  height TEXT,
  light_soil_requirements TEXT,
  plant_use TEXT,
  growing_tips TEXT
);

CREATE TABlE journals (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  username VARCHAR(15) NOT NULL
    REFERENCES users ON DELETE CASCADE
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  username VARCHAR(15)
    REFERENCES users ON DELETE CASCADE,
  plant_id INTEGER
    REFERENCES plants ON DELETE CASCADE,
  journal_id INTEGER
    REFERENCES journals ON DELETE CASCADE,
  title TEXT NOT NULL,
  post_body TEXT NOT NULL
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  img TEXT,
  username VARCHAR(15) NOT NULL
    REFERENCES users ON DELETE CASCADE,
  plant_id INTEGER
    REFERENCES plants ON DELETE CASCADE,
  post_id INTEGER
    REFERENCES posts ON DELETE CASCADE
);
