import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
const OneGenre = () => {
    // we need to get the "prop" passed to this component
    const location = useLocation();
    const { genreName } = location.state || {};

    // set stateful variables
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);

    // get the id from the url
    const { id } = useParams();

    // useEffect to get list of moives
    useEffect(() => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        };

        fetch(`/movies/genres/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.message);
                } else {
                    setMovies(data);
                }
            })
            .catch(error => setError(error));
    }, [id]); // dependency array to run effect when id changes
    // return the JSX to render
    return (
        <>
            <h2>Movies in Genre: {genreName}</h2>
            <hr />
            {movies ? (
            <table className="table">
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
                            <td>{movie.releaseDate}</td>
                            <td>{movie.rating}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            ):(
                <p>No movies in this genre (yet)</p>
            )}
        </>
    );
}

export default OneGenre;