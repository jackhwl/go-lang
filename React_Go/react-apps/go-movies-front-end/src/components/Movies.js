import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        let moviesList = [
            {
                id: 1,
                title: "Highlander",
                release_date: "1986-03-07",
                runtime: 116,
                mpaa_rating: "R",
                description: "Some long description Frank Darabont"
            },
            {
                id: 2,
                title: "The Shawshank Redemption",
                release_date: "1994-09-23",
                runtime: 142,
                mpaa_rating: "R",
                description: "Some long description Frank Darabont"
            },
            {
                id: 3,
                title: "The Godfather",
                release_date: "1972-03-24",
                runtime: 175,
                mpaa_rating: "R",
                description: "Some long description Francis Ford Coppola"
            }
        ];
        setMovies(moviesList);
    }, []);

    return (
        <div>
            <h2>Movie!</h2>
            <hr />
            <table className='table table-striped table-hover'>
                <thead>
                    <tr>
                        <th>Movie</th>
                        <th>Release Date</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map(movie => (
                        <tr key={movie.id}>
                            <td>
                                <Link to={`/movies/${movie.id}`}>
                                    {movie.title}
                                </Link>
                            </td>
                            <td>{movie.release_date}</td>
                            <td>{movie.mpaa_rating}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default Movies;