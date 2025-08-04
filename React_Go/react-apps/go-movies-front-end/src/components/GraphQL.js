import { useEffect, useState } from "react";
import Input from "./form/Input";
import { Link } from 'react-router-dom';

const GraphQL = () => {
    // setup stateful variables
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [fullList, setFullList] = useState([]);

    // perform a search
    const performSearch = async (e) => {
        e.preventDefault(); 
    }

    const handleChange = (e) => {
    }
    //useEffect
    useEffect(() => {
        const payload = `
        {
            list {
                id
                title
                runtime
                release_date
                mpaa_rating
            }
        }`;

        const headers = new Headers();
        headers.append("Content-Type", "application/graphql");

        const requestOptions = {
            method: "POST",
            headers: headers,
            body: payload
        };

        fetch(`/graph`, requestOptions)
            .then((response) => response.json())
            .then((response) => {
                let theList = Object.values(response.data.list);
                setMovies(theList);
                setFullList(theList);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
        }, []);

    return (
        <div>
            <h2>GraphQL!</h2>
            <hr />
            <form onSubmit={handleChange}>
                <Input title={"Search"} type={"search"} name={"search"} className={"form-control"} value={searchTerm} onChange={handleChange} />
            </form>
            { movies ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Movie</th>
                            <th>Release Date</th>
                            <th>MPAA Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map((movie) => (
                            <tr key={movie.id}>
                                <td><Link to={`/movies/${movie.id}`}>{movie.title}</Link></td>
                                <td>{new Date(movie.release_date).toLocaleDateString()}</td>
                                <td>{movie.mpaa_rating}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="alert alert-info">No movies found</div>
            )}
        </div>
    )
}
export default GraphQL;