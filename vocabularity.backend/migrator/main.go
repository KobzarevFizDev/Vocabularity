package main

import (
	"database/sql"
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"

	_ "github.com/lib/pq"
)

func main() {
	host := flag.String("host", envOr("DB_HOST", "127.0.0.1"), "database host")
	port := flag.String("port", envOr("DB_PORT", "5000"), "database port")
	user := flag.String("user", envOr("DB_USER", "vocabularity"), "database user")
	password := flag.String("password", envOr("DB_PASSWORD", "1234567890"), "database password")
	dbname := flag.String("dbname", envOr("DB_NAME", "vocabularity"), "database name")
	migrationsDir := flag.String("dir", envOr("MIGRATIONS_DIR", "../migrations"), "migrations directory")
	flag.Parse()

	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		*host, *port, *user, *password, *dbname,
	)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("failed to ping database: %v", err)
	}

	log.Println("connected to database")

	if err := ensureSchemaMigrations(db); err != nil {
		log.Fatalf("failed to ensure schema_migrations table: %v", err)
	}

	files, err := listMigrationFiles(*migrationsDir)
	if err != nil {
		log.Fatalf("failed to list migration files: %v", err)
	}

	if len(files) == 0 {
		log.Println("no migration files found")
		return
	}

	applied, err := getAppliedMigrations(db)
	if err != nil {
		log.Fatalf("failed to get applied migrations: %v", err)
	}

	for _, file := range files {
		if applied[file] {
			log.Printf("skipping %s (already applied)", file)
			continue
		}

		log.Printf("applying %s...", file)
		path := filepath.Join(*migrationsDir, file)
		sqlUp, err := parseMigration(path)
		if err != nil {
			log.Fatalf("failed to parse migration %s: %v", file, err)
		}

		if err := applyMigration(db, file, sqlUp); err != nil {
			log.Fatalf("failed to apply migration %s: %v", file, err)
		}

		log.Printf("applied %s", file)
	}

	log.Println("all migrations applied successfully")
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func ensureSchemaMigrations(db *sql.DB) error {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS schema_migrations (
			filename VARCHAR(255) PRIMARY KEY,
			applied_at TIMESTAMP NOT NULL DEFAULT NOW()
		)
	`)
	return err
}

func listMigrationFiles(dir string) ([]string, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}

	var files []string
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		if strings.HasSuffix(entry.Name(), ".sql") {
			files = append(files, entry.Name())
		}
	}

	sort.Strings(files)
	return files, nil
}

func getAppliedMigrations(db *sql.DB) (map[string]bool, error) {
	rows, err := db.Query("SELECT filename FROM schema_migrations")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	applied := make(map[string]bool)
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, err
		}
		applied[name] = true
	}
	return applied, rows.Err()
}

func parseMigration(path string) (string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}

	content := string(data)
	lines := strings.Split(content, "\n")

	var upLines []string
	inUp := false

	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		if trimmed == "-- +goose Up" {
			inUp = true
			continue
		}
		if trimmed == "-- +goose Down" {
			break
		}
		if inUp {
			upLines = append(upLines, line)
		}
	}

	return strings.Join(upLines, "\n"), nil
}

func applyMigration(db *sql.DB, filename, sqlUp string) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err := tx.Exec(sqlUp); err != nil {
		return err
	}

	if _, err := tx.Exec("INSERT INTO schema_migrations (filename) VALUES ($1)", filename); err != nil {
		return err
	}

	return tx.Commit()
}
