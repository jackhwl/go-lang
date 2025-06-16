package main

import (
	"net/http"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
)

func (app *application) routes() http.Handler {
	mux := chi.NewRouter()

	mux.Use(middleware.Recoverer) // Recover from panics and return a 500 error
	mux.Use(app.enableCORS)       // Enable CORS for all routes

	mux.Get("/", app.Home) // Handle the root path with the Home handler

	mux.Post("/authenticate", app.authenticate) // Handle the /authenticate path with the authenticate handler
	mux.Get("/refresh", app.refreshToken)       // Handle the /refresh path with the refresh handler

	mux.Get("/movies", app.AllMovies) // Handle the /movies path with the AllMovies handler
	// Return the mux as the handler
	return mux
}
