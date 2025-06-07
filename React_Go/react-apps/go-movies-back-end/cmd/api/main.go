package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
)

const port = 8080

type application struct {
	DSN    string
	Domain string
}

func main() {
	// set appication config
	var app application
	// read from command line
	flag.StringVar(&app.DSN, "dsn", "host=localhost port=5432 user=postgres password=postgres dbname=movies sslmode=disable timezone=UTC connect_timeout=5", "PostgreSQL connection string")
	flag.Parse()
	// connect to the database
	app.Domain = "example.com"
	log.Println("Starting application on port", port)
	// http.HandleFunc("/", Hello)
	// start a web server

	err := http.ListenAndServe(fmt.Sprintf(":%d", port), app.routes())
	if err != nil {
		log.Fatal(err)
	}
}
