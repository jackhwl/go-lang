import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Input from "./form/Input";
import Select from "./form/Select";
import TextArea from "./form/TextArea";
import Checkbox from "./form/Checkbox";

const EditMovie = () => {
    const navigate = useNavigate();
    const { jwtToken } = useOutletContext();

    const [error, setError] = useState(null);
    const [erroors, setErrors] = useState([]);

    const mpaaOptions = [
        { id: "G", value: "G"},
        { id: "PG", value: "PG"},
        { id: "PG-13", value: "PG-13"},
        { id: "R", value: "R"},
        { id: "NC-17", value: "NC-17"},
        { id: "18A", value: "18A"},
    ];

    const hasError = (key) => {
        return erroors.includes(key);
    }

    const [movie, setMovie] = useState({
        id: "",
        title: "",
        release_date: "",
        mpaa_rating: "",
        description: "",
        runtime: "",
        genres: [],
        genres_array: [Array(13).fill(false)]
    });



    // get id from URL
    let { id } = useParams();

    if (id === undefined) {
        id = 0;
    }    
    useEffect(() => {
        if (jwtToken === "") {
            navigate('/login');
            return;
        }

        if (id === 0) {
            // New movie, no need to fetch data
            setMovie({
                id: 0,
                title: "",
                release_date: "",
                mpaa_rating: "",
                description: "",
                runtime: "",
                genres: [],
                genres_array: [Array(13).fill(false)]
            });

            const headers = new Headers();
            headers.append('Content-Type', 'application/json');

            const requestOptions = {
                method: 'GET',
                headers: headers,
            };

            fetch(`/genres`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    let genres = data.map(g => {
                        return {
                            id: g.id,
                            genre: g.genre,
                            checked: false
                        }
                    });
                    setMovie(m => ({
                        ...movie,
                        genres: genres,
                        genres_array: Array(genres.length).fill(false)
                    }));
                })
                .catch((error) => {
                    console.error('Error fetching genres:', error);
                });
        } else {
            // Fetch movie data for editing
                    }
    }, [id, jwtToken, navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
    };

    const handleChange = () => (event) => {
        let value = event.target.value;
        let name = event.target.name;
        setMovie({...movie, [name]: value });
    }

    const handleCheck = (event, index) => {
        let value = event.target.value;
        let checked = event.target.checked;

        console.log("handleCheck, value, checked, index", value, checked, index);
    }

    return (
        <div>
            <h2>Add/Edit Movie!</h2>
            <hr />
            <pre>{JSON.stringify(movie, null, 3)}</pre>

            <form onSubmit={handleSubmit}>
                <input type="hidden" id="id" name="id" value={movie.id} />

                <div className="mb-3">
                    <Input title={"Title"}
                        className={"form-control"}
                        type={"text"}
                        name={"title"}
                        value={movie.title}
                        onChange={handleChange("title")}
                        errorDiv={hasError("title") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a title"}
                    />

                    <Input title={"Release Date"}
                        className={"form-control"}
                        type={"date"}
                        name={"release_date"}
                        value={movie.release_date}
                        onChange={handleChange("release_date")}
                        errorDiv={hasError("release_date") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a release date"}
                    />

                    <Input title={"Runtime"}
                        className={"form-control"}
                        type={"text"}
                        name={"runtime"}
                        value={movie.runtime}
                        onChange={handleChange("runtime")}
                        errorDiv={hasError("runtime") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a runtime"}
                    />

                    <Select title={"MPAA Rating"}
                        name={"mpaa_rating"}
                        value={movie.mpaa_rating}
                        onChange={handleChange("mpaa_rating")}
                        options={mpaaOptions}
                        placeHolder={"Select MPAA Rating"}
                        errorDiv={hasError("mpaa_rating") ? "text-danger" : "d-none"}
                        errorMsg={"Please select an MPAA rating"}
                    />

                    <TextArea title={"Description"}
                        name={"description"}
                        value={movie.description}
                        onChange={handleChange("description")}
                        placeholder={"Enter a description"}
                        rows={3}
                        errorDiv={hasError("description") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a description"}
                    />

                    <hr />
                    <h3>Genres</h3>
                    {movie.genres && movie.genres.map((genre, index) => (
                        <div key={genre.id} className="form-check">
                            <Checkbox 
                                title={genre.genre}
                                name={`genre`}
                                key={index}
                                id={`genre-${index}`}
                                onChange={(e) => handleCheck(e, index)}
                                value={genre.id}
                                checked={movie.genres_array[index].checked} />
                        </div>
                    ))}
                </div>
                    <button type="submit" className="btn btn-primary mt-3">Save</button>
                <div className="text-danger">{error}</div>      
            </form>
        </div>
    )
}
export default EditMovie;