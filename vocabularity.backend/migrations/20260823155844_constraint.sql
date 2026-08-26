-- +goose Up
ALTER TABLE words ADD CONSTRAINT word_uq UNIQUE (word, translation)

-- +goose Down
ALTER TABLE words DROP CONSTRAINT word_uq;