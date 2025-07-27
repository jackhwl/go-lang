package dbrepo

import (
	"backend/internal/models"
	"context"
	"database/sql"
	"time"
)

type PostgresDBRepo struct {
	DB *sql.DB
}

const dbTimeout = time.Second * 3

func (m *PostgresDBRepo) Connection() *sql.DB {
	// Return the database connection.
	return m.DB
}
func (m *PostgresDBRepo) AllMovies() ([]*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()
	// This is a placeholder implementation.
	// In a real application, you would query the database here.

	query := `
		SELECT 
			id, title, description, release_date, mpaa_rating, 
			coalesce(image, ''), created_at, updated_at
		FROM 
			movies
		ORDER BY 
			title ASC
	`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*models.Movie
	for rows.Next() {
		var m models.Movie
		err := rows.Scan(
			&m.ID,
			&m.Title,
			&m.Description,
			&m.ReleaseDate,
			&m.MPAARating,
			&m.Image,
			&m.CreatedAt,
			&m.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		movies = append(movies, &m)
	}
	return movies, nil
}

func (m *PostgresDBRepo) OneMovie(id int) (*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
		SELECT 
			id, title, description, release_date, runtime, mpaa_rating, 
			coalesce(image, ''), created_at, updated_at
		FROM 
			movies
		WHERE 
			id = $1
	`
	var movie models.Movie
	row := m.DB.QueryRowContext(ctx, query, id)
	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.Description,
		&movie.ReleaseDate,
		&movie.RunTime,
		&movie.MPAARating,
		&movie.Image,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // Movie not found
		}
		return nil, err // Other error
	}

	// get genres for the movie
	genreQuery := `
		SELECT 
			g.id, g.genre
		FROM 
			movies_genres mg
		LEFT JOIN 
			genres g on mg.genre_id = g.id
		WHERE 
			mg.movie_id = $1
		ORDER BY 
			g.genre ASC
	`
	rows, err := m.DB.QueryContext(ctx, genreQuery, id)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	defer rows.Close()

	var genres []*models.Genre
	for rows.Next() {
		var g models.Genre
		err := rows.Scan(&g.ID, &g.Genre)
		if err != nil {
			return nil, err
		}
		g.Checked = false // Default to unchecked
		genres = append(genres, &g)
	}

	movie.Genres = genres

	return &movie, err
}

func (m *PostgresDBRepo) OneMovieForEdit(id int) (*models.Movie, []*models.Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
		SELECT 
			id, title, description, release_date, runtime, mpaa_rating, 
			coalesce(image, ''), created_at, updated_at
		FROM 
			movies
		WHERE 
			id = $1
	`
	var movie models.Movie
	row := m.DB.QueryRowContext(ctx, query, id)
	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.Description,
		&movie.ReleaseDate,
		&movie.RunTime,
		&movie.MPAARating,
		&movie.Image,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil, nil // Movie not found
		}
		return nil, nil, err // Other error
	}

	// get genres for the movie
	genreQuery := `
		SELECT 
			g.id, g.genre
		FROM 
			movies_genres mg
		LEFT JOIN 
			genres g on mg.genre_id = g.id
		WHERE 
			mg.movie_id = $1
		ORDER BY 
			g.genre ASC
	`
	rows, err := m.DB.QueryContext(ctx, genreQuery, id)
	if err != nil && err != sql.ErrNoRows {
		return nil, nil, err
	}
	defer rows.Close()

	var genres []*models.Genre
	var genresArray []int
	for rows.Next() {
		var g models.Genre
		err := rows.Scan(&g.ID, &g.Genre)
		if err != nil {
			return nil, nil, err
		}
		g.Checked = false // Default to unchecked
		genres = append(genres, &g)
		genresArray = append(genresArray, g.ID) // Collect genre IDs for the movie
	}

	movie.Genres = genres
	movie.GenresArray = genresArray // Store the genre IDs in the movie struct

	var allGenres []*models.Genre
	// get all genres
	allGenresQuery := `		
		SELECT 
			id, genre
		FROM 
			genres
		ORDER BY 
			genre
			`
	rows, err = m.DB.QueryContext(ctx, allGenresQuery)
	if err != nil && err != sql.ErrNoRows {
		return nil, nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var g models.Genre
		err := rows.Scan(&g.ID, &g.Genre)
		if err != nil {
			return nil, nil, err
		}

		allGenres = append(allGenres, &g)
	}

	return &movie, allGenres, err
}

func (m *PostgresDBRepo) GetUserByEmail(email string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
		SELECT 
			id, first_name, last_name, email, password, created_at, updated_at
		FROM 
			users
		WHERE 
			email = $1
	`

	var user models.User
	row := m.DB.QueryRowContext(ctx, query, email)
	err := row.Scan(
		&user.ID,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // User not found
		}
		return nil, err // Other error
	}

	return &user, nil
}

func (m *PostgresDBRepo) GetUserByID(id int) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
		SELECT 
			id, first_name, last_name, email, password, created_at, updated_at
		FROM 
			users
		WHERE 
			id = $1
	`

	var user models.User
	row := m.DB.QueryRowContext(ctx, query, id)
	err := row.Scan(
		&user.ID,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // User not found
		}
		return nil, err // Other error
	}

	return &user, nil
}

func (m *PostgresDBRepo) AllGenres() ([]*models.Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
		SELECT 
			id, genre, created_at, updated_at
		FROM 
			genres
		ORDER BY 
			genre ASC
	`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var genres []*models.Genre
	for rows.Next() {
		var g models.Genre
		err := rows.Scan(&g.ID, &g.Genre, &g.CreatedAt, &g.UpdatedAt)
		if err != nil {
			return nil, err
		}
		g.Checked = false // Default to unchecked
		genres = append(genres, &g)
	}

	return genres, nil
}

func (m *PostgresDBRepo) InsertMovie(movie *models.Movie) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	stmt := `
		INSERT INTO movies (title, description, release_date, runtime, mpaa_rating,
			image, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id
	`
	var newID int

	err := m.DB.QueryRowContext(ctx, stmt,
		movie.Title,
		movie.Description,
		movie.ReleaseDate,
		movie.RunTime,
		movie.MPAARating,
		movie.Image,
		movie.CreatedAt,
		movie.UpdatedAt,
	).Scan(&newID)

	if err != nil {
		return 0, err
	}

	return newID, nil
}

func (m *PostgresDBRepo) UpdateMovie(movie models.Movie) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	stmt := `
		UPDATE movies
		SET title = $1, description = $2, release_date = $3, runtime = $4,
			mpaa_rating = $5, image = $6, updated_at = $7
		WHERE id = $8
	`
	_, err := m.DB.ExecContext(ctx, stmt,
		movie.Title,
		movie.Description,
		movie.ReleaseDate,
		movie.RunTime,
		movie.MPAARating,
		movie.Image,
		movie.UpdatedAt,
		movie.ID,
	)

	if err != nil {
		return err
	}

	return nil
}

func (m *PostgresDBRepo) UpdateMovieGenres(movieID int, genreIDs []int) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	// First, remove existing genres for the movie
	deleteStmt := `
		DELETE FROM movies_genres
		WHERE movie_id = $1
	`
	_, err := m.DB.ExecContext(ctx, deleteStmt, movieID)
	if err != nil {
		return err
	}

	// Now, insert the new genre associations
	insertStmt := `
		INSERT INTO movies_genres (movie_id, genre_id)
		VALUES ($1, $2)
	`
	for _, genreID := range genreIDs {
		_, err := m.DB.ExecContext(ctx, insertStmt, movieID, genreID)
		if err != nil {
			return err
		}
	}

	return nil
}
