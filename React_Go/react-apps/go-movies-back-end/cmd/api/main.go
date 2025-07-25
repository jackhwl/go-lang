package main

import (
	"backend/internal/repository"
	"backend/internal/repository/dbrepo"
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"
)

const port = 8080

type application struct {
	DSN          string
	Domain       string
	DB           repository.DatabaseRepo
	auth         Auth
	JWTSecret    string
	JWTIssuer    string
	JWTAudience  string
	CookieDomain string
	APIKey       string
}

func main() {
	// set appication config
	var app application

	// read from command line
	flag.StringVar(&app.DSN, "dsn", "host=localhost port=5432 user=postgres password=postgres dbname=movies sslmode=disable timezone=UTC connect_timeout=5", "PostgreSQL connection string")
	flag.StringVar(&app.JWTSecret, "jwt-secret", "mysecret", "JWT secret key")
	flag.StringVar(&app.JWTIssuer, "jwt-issuer", "go-movies", "JWT issuer")
	flag.StringVar(&app.JWTAudience, "jwt-audience", "go-movies-users", "JWT audience")
	flag.StringVar(&app.CookieDomain, "cookie-domain", "localhost", "Cookie domain for JWT")
	flag.StringVar(&app.Domain, "domain", "example.com", "Domain for the application")
	flag.StringVar(&app.APIKey, "api-key", "65da03e73a93b102f3265cf3f59d70d1", "API key for external services")
	flag.Parse()

	// connect to the database
	conn, err := app.connectToDB()
	if err != nil {
		log.Fatal("Cannot connect to database:", err)
	}
	app.DB = &dbrepo.PostgresDBRepo{
		DB: conn,
	}
	defer app.DB.Connection().Close()

	app.auth = Auth{
		Issuer:        app.JWTIssuer,
		Audience:      app.JWTAudience,
		Secret:        app.JWTSecret,
		TokenExpiry:   15 * time.Minute, // 15 minutes
		RefreshExpiry: 24 * time.Hour,   // 24 hours
		CookieDomain:  app.CookieDomain,
		CookiePath:    "/",
		CookieName:    "refresh_jwt_token",
	}

	log.Println("Starting application on port", port)
	// http.HandleFunc("/", Hello)
	// start a web server

	err = http.ListenAndServe(fmt.Sprintf(":%d", port), app.routes())
	if err != nil {
		log.Fatal(err)
	}
}
