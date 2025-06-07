package main

import (
	"database/sql"
	"log"

	_ "github.com/jackc/pgconn"
	_ "github.com/jackc/pgx/v4"
	_ "github.com/jackc/pgx/v4/stdlib"
)

func openDB(dsn string) (*sql.DB, error) {
	// Open a new database connection using the provided DSN.
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, err
	}

	// Verify the connection to the database.
	if err = db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}

func (app *application) connectToDB() (*sql.DB, error) {
	// Open a new database connection.
	connection, err := openDB(app.DSN)
	if err != nil {
		return nil, err
	}

	log.Println("Connected to Postgres!")

	return connection, nil
}
