import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Input from "./form/Input";
import Select from "./form/Select";
import TextArea from "./form/TextArea";
import Checkbox from "./form/Checkbox";
import Swal from 'sweetalert2'

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

            fetch(`${process.env.REACT_APP_BACKEND}/genres`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    let genres = data.map(g => {
                        return {
                            id: g.id,
                            genre: g.genre,
                            checked: false
                        }
                    });
                    setMovie(movie => ({
                        ...movie,
                        genres: genres,
                        genres_array: [],
                    }));
                })
                .catch((error) => {
                    console.error('Error fetching genres:', error);
                });
        } else {
            // Fetch movie data for editing
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', `Bearer ${jwtToken}`);
            const requestOptions = {
                method: 'GET',
                headers: headers,
            };
            fetch(`${process.env.REACT_APP_BACKEND}/admin/movies/${id}`, requestOptions)
                .then((response) => {
                    if (response.status !== 200) {
                        setError("invalid response code: " + response.status)
                    }
                    return response.json()
                })
                .then((data) => {
                    // fix release date
                    console.log("data", data);
                    data.movie.release_date = new Date(data.movie.release_date).toISOString().split('T')[0]; // Format date for input
                    const checks = []
                    data.genres.forEach((g) => {
                        if (data.movie.genres_array.indexOf(g.id) !== -1) {
                            checks.push({
                                id: g.id,
                                genre: g.genre,
                                checked: true
                            });
                        } else {
                            checks.push({
                                id: g.id,
                                genre: g.genre,
                                checked: false
                            });
                        }
                    }); 
                    // Set movie data
                    setMovie({
                        ...data.movie,
                        genres: checks,
                    });
                })
                .catch((error) => {
                    console.error('Error fetching movie:', error);
                    setError("An error occurred while fetching the movie.");
                }
            );
        }
    }, [id, jwtToken, navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here

        let errors = [];
        let required = [
            { field: movie.title, name: "title" },
            { field: movie.release_date, name: "release_date" },
            { field: movie.mpaa_rating, name: "mpaa_rating" },
            { field: movie.description, name: "description" },
            { field: movie.runtime, name: "runtime" }
        ];

        required.forEach((item) => {
            if (item.field === "") {
                errors.push(item.name);
            }
        });

        if (movie.genres_array.length === 0) {
            Swal.fire({
                title: "Error",
                text: "Please select at least one genre",
                icon: "error",
                confirmButtonText: "OK"
            });
            errors.push("genres");
        }

        setErrors(errors);

        if (errors.length > 0) {        
            return false
        }

        // passed validation, so save changes
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${jwtToken}`);

        let method = "PUT";

        if (movie.id > 0) {
            method = "PATCH"; // Update existing movie
        }

        const requestBody = movie;
        
        requestBody.release_date = new Date(movie.release_date);
        requestBody.runtime = parseInt(movie.runtime, 10);

        let requestOptions = {
            method: method,
            headers: headers,
            body: JSON.stringify(requestBody),
            credentials: 'include'
        };

        fetch(`${process.env.REACT_APP_BACKEND}/admin/movies/${movie.id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.error("Error:", data.error);
                } else {
                    navigate("/manage-catalogue");
                }
            })
            .catch((error) => {
                console.error('Error saving movie:', error);
                //setError("An error occurred while saving the movie.");
            });
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

        let tmpArr = movie.genres;
        tmpArr[index].checked = !tmpArr[index].checked;

        let tempIDs = movie.genres_array;
        if (!event.target.checked) {
            tempIDs.splice(tempIDs.indexOf(event.target.value));
        }
        else {
            tempIDs.push(parseInt(event.target.value, 10));
        }

        setMovie({
            ...movie,
            genres_array: tempIDs
        })
    }
    
    const confirmDelete = () => {
        Swal.fire({
            title: "Delete movie?",
            text: "You cannot undo this action!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const headers = new Headers();
                headers.append('Content-Type', 'application/json');
                headers.append('Authorization', `Bearer ${jwtToken}`);

                const requestOptions = {
                    method: 'DELETE',
                    headers: headers,
                    credentials: 'include'
                };

                fetch(`${process.env.REACT_APP_BACKEND}/admin/movies/${movie.id}`, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.error) {
                            console.error("Error:", data.error);
                        } else {
                            navigate("/manage-catalogue");
                        }
                    })
                    .catch((error) => {
                        console.error('Error deleting movie:', error);
                    });
            }
        });
    };

    if (error !== null) {
        return (
            <div className="text-danger">Error: {error.message}</div>
        );
    } else {
        return (
            <div>
                <h2>Add/Edit Movie!</h2>
                <hr />
                {/* <pre>{JSON.stringify(movie, null, 3)}</pre> */}

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
                        {movie.genres && Array.from(movie.genres).map((genre, index) => (
                                <Checkbox 
                                    title={genre.genre}
                                    name={`genre`}
                                    key={index}
                                    id={`genre-${index}`}
                                    onChange={(e) => handleCheck(e, index)}
                                    value={genre.id}
                                    checked={movie.genres[index].checked} />
                        ))}
                    </div>
                    <hr />
                    <button type="submit" className="btn btn-primary mt-3">Save</button>
                    { movie.id > 0 &&
                        <a href="#!" className="btn btn-danger mt-3 ms-2" onClick={confirmDelete}>Delete Movie</a>
                    }
                </form>
            </div>
        )
    }
}
export default EditMovie;