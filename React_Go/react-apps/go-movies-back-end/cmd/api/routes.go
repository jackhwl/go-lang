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
	mux.Get("/logout", app.logout)              // Handle the /logout path with the logout handler

	mux.Get("/movies", app.AllMovies)     // Handle the /movies path with the AllMovies handler
	mux.Get("/movies/{id}", app.GetMovie) // Handle the /movies/{id} path with the OneMovie handler

	mux.Get("/genres", app.AllGenres)                    // Handle the /genres path with the AllGenres handler
	mux.Get("/movies/genres/{id}", app.AllMoviesByGenre) // Handle the /genres/{id} path with the OneGenre handler

	mux.Post("/graph", app.moviesGraphQL) // Handle the /graphql path with the GraphQL handler

	mux.Route("/admin", func(mux chi.Router) {
		mux.Use(app.authRequired) // Require authentication for all routes under /admin

		mux.Get("/movies", app.MoiveCatalog)        // Handle the /admin/movies path with the AdminAllMovies handler
		mux.Get("/movies/{id}", app.MovieForEdit)   // Handle the /admin/movies/{id} path with the AdminOneMovie handler
		mux.Put("/movies/0", app.InsertMovie)       // Handle the /admin/movies/0 path with the InsertMovie handler
		mux.Patch("/movies/{id}", app.UpdateMovie)  // Handle the /admin/movies/{id} path with the UpdateMovie handler
		mux.Delete("/movies/{id}", app.DeleteMovie) // Handle the /admin/movies/{id} path with the DeleteMovie handler
	})
	// Return the mux as the handler
	return mux
}
