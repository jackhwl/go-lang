package main

import (
	"backend/internal/models"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v4"
)

func (app *application) Home(w http.ResponseWriter, r *http.Request) {
	// fmt.Fprintf(w, "Hello, World from %s!", app.Domain)
	var payload = struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Version string `json:"version"`
	}{
		Status:  "active",
		Message: "Go Movies up and running",
		Version: "1.0.0",
	}

	_ = app.writeJSON(w, http.StatusOK, payload)
}

func (app *application) AllMovies(w http.ResponseWriter, r *http.Request) {
	movies, err := app.DB.AllMovies()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, movies)
}

func (app *application) authenticate(w http.ResponseWriter, r *http.Request) {
	// read json payload
	var requestPayload struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := app.readJSON(w, r, &requestPayload)
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	// validate user against database
	user, err := app.DB.GetUserByEmail(requestPayload.Email)
	if err != nil {
		app.errorJSON(w, errors.New("invalid credentials"), http.StatusBadRequest)
		return
	}

	// check password
	valid, err := user.PasswordMatches(requestPayload.Password)
	if err != nil || !valid {
		app.errorJSON(w, errors.New("invalid credentials"), http.StatusBadRequest)
		return
	}
	// create a jwt user
	u := jwtUser{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}

	// generate a tokens
	tokens, err := app.auth.GenerateTokenPair(&u)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	// log.Println(tokens.AccessToken)
	refreshCookie := app.auth.GetRefreshCookie(tokens.RefreshToken)
	http.SetCookie(w, refreshCookie) // Set the refresh token cookie in the response

	app.writeJSON(w, http.StatusAccepted, tokens)
}

func (app *application) refreshToken(w http.ResponseWriter, r *http.Request) {
	for _, cookie := range r.Cookies() {
		if cookie.Name == app.auth.CookieName {
			claims := &Claims{}
			refreshToken := cookie.Value

			// parse the refresh token to extract claims
			_, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
				return []byte(app.JWTSecret), nil
			})

			if err != nil {
				app.errorJSON(w, errors.New("unauthorized"), http.StatusUnauthorized)
				return
			}

			// get the user ID from the claims
			userID, err := strconv.Atoi(claims.Subject)
			if err != nil {
				app.errorJSON(w, errors.New("unknown user"), http.StatusUnauthorized)
				return
			}

			user, err := app.DB.GetUserByID(userID)
			if err != nil {
				app.errorJSON(w, errors.New("unknown user"), http.StatusUnauthorized)
				return
			}

			u := jwtUser{
				ID:        user.ID,
				FirstName: user.FirstName,
				LastName:  user.LastName,
			}

			tokenPairs, err := app.auth.GenerateTokenPair(&u)

			http.SetCookie(w, app.auth.GetRefreshCookie(tokenPairs.RefreshToken)) // Set the refresh token cookie in the response

			app.writeJSON(w, http.StatusOK, tokenPairs)
			return
		}
	}
}

func (app *application) logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, app.auth.GetExpiredRefreshCookie()) // Set an expired cookie to clear the refresh token
	w.WriteHeader(http.StatusAccepted)
}

func (app *application) MoiveCatalog(w http.ResponseWriter, r *http.Request) {
	movies, err := app.DB.AllMovies()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, movies)
}

func (app *application) GetMovie(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idParam)
	if err != nil || id <= 0 {
		app.errorJSON(w, errors.New("invalid id"), http.StatusBadRequest)
		return
	}

	movie, err := app.DB.OneMovie(id)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	if movie == nil {
		app.errorJSON(w, errors.New("movie not found"), http.StatusNotFound)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, movie)

}

func (app *application) MovieForEdit(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idParam)
	if err != nil || id <= 0 {
		app.errorJSON(w, errors.New("invalid movie ID"), http.StatusBadRequest)
		return
	}

	movie, genres, err := app.DB.OneMovieForEdit(id)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	if movie == nil {
		app.errorJSON(w, errors.New("movie not found"), http.StatusNotFound)
		return
	}

	response := struct {
		Movie  *models.Movie   `json:"movie"`
		Genres []*models.Genre `json:"genres"`
	}{
		Movie:  movie,
		Genres: genres,
	}

	_ = app.writeJSON(w, http.StatusOK, response)

}

func (app *application) AllGenres(w http.ResponseWriter, r *http.Request) {
	genres, err := app.DB.AllGenres()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	if genres == nil {
		app.errorJSON(w, errors.New("no genres found"), http.StatusNotFound)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, genres)
}

func (app *application) InsertMovie(w http.ResponseWriter, r *http.Request) {
	var movie models.Movie

	err := app.readJSON(w, r, &movie)
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	// try to get an image
	movie = app.getPoster(movie)

	movie.CreatedAt = time.Now()
	movie.UpdatedAt = time.Now()

	newID, err := app.DB.InsertMovie(&movie)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	// now handle genres
	err = app.DB.UpdateMovieGenres(newID, movie.GenresArray)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	if movie.Title == "" || movie.Description == "" || len(movie.Genres) == 0 {
		app.errorJSON(w, errors.New("missing required fields"), http.StatusBadRequest)
		return
	}

	movie.ID = newID
	app.writeJSON(w, http.StatusCreated, movie)
}

func (app *application) getPoster(movie models.Movie) models.Movie {
	type TheMovieDB struct {
		Page    int `json:"page"`
		Results []struct {
			PosterPath string `json:"poster_path"`
		} `json:"results"`
		TotalPages int `json:"total_pages"`
	}

	client := &http.Client{}
	theUrl := fmt.Sprint("https://api.themoviedb.org/3/search/movie?api_key=", app.APIKey)

	req, err := http.NewRequest("GET", theUrl+"&query="+url.QueryEscape(movie.Title), nil)
	if err != nil {
		log.Println(err)
		return movie // Return the movie as is if there's an error
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		log.Println(err)
		return movie // Return the movie as is if there's an error
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
		return movie // Return the movie as is if there's an error
	}

	var responseObject TheMovieDB

	json.Unmarshal(bodyBytes, &responseObject)

	if len(responseObject.Results) > 0 {
		posterPath := responseObject.Results[0].PosterPath
		if posterPath != "" {
			movie.Image = posterPath
		}
	}

	return movie
}

func (app *application) UpdateMovie(w http.ResponseWriter, r *http.Request) {
	var payload models.Movie
	err := app.readJSON(w, r, &payload)
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	movie, err := app.DB.OneMovie(payload.ID)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	movie.Title = payload.Title
	movie.Description = payload.Description
	movie.ReleaseDate = payload.ReleaseDate
	movie.RunTime = payload.RunTime
	movie.MPAARating = payload.MPAARating
	movie.UpdatedAt = time.Now()

	err = app.DB.UpdateMovie(*movie)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	err = app.DB.UpdateMovieGenres(movie.ID, payload.GenresArray)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	resp := JSONResponse{
		Message: "Movie updated successfully",
		Error:   false,
	}
	app.writeJSON(w, http.StatusAccepted, resp)
}

func (app *application) DeleteMovie(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idParam)
	if err != nil || id <= 0 {
		app.errorJSON(w, errors.New("invalid movie ID"), http.StatusBadRequest)
		return
	}

	err = app.DB.DeleteMovie(id)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	resp := JSONResponse{
		Message: "Movie deleted successfully",
		Error:   false,
	}
	app.writeJSON(w, http.StatusAccepted, resp)
}
