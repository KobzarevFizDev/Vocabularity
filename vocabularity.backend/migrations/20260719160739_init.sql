-- +goose Up
CREATE TABLE IF NOT EXISTS levels(
   id UUID PRIMARY KEY,
   value VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS words(
   id UUID PRIMARY KEY,
   word VARCHAR(255) NOT NULL,
   translation VARCHAR(255) NOT NULL,
   transcription VARCHAR(255) NOT NULL,
   examples VARCHAR(255)[] NOT NULL,
   context_sentence VARCHAR(255) NOT NULL,
   level_id UUID NOT NULL,
   FOREIGN KEY (level_id) REFERENCES levels(id)
);

INSERT INTO levels (id, value)
VALUES
   (gen_random_uuid(), 'A1'),
   (gen_random_uuid(), 'A2'),
   (gen_random_uuid(), 'B1'),
   (gen_random_uuid(), 'B2'),
   (gen_random_uuid(), 'C1'),
   (gen_random_uuid(), 'C2');


-- +goose Down
DROP TABLE IF EXISTS words;
DROP TABLE IF EXISTS levels;
