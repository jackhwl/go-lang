import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Input from "./form/Input";

const EditMovie = () => {
    const navigate = useNavigate();
    const { jwtToken } = useOutletContext();

    const [error, setError] = useState(null);
    const [erroors, setErrors] = useState([]);
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
    });



    // get id from URL
    let { id } = useParams();

    useEffect(() => {
        if (jwtToken === "") {
            navigate('/login');
            return;
        }
    }, [jwtToken, navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
    };

    const handleChange = () => (event) => {
        let value = event.target.value;
        let name = event.target.name;
        setMovie({...movie, [name]: value });
    }


    return (
        <div>
            <h2>Add/Edit Movie!</h2>
            <hr />
            <pre>{JSON.stringify(movie, null, 3)}</pre>

            <form onSubmit={handleSubmit}>
                <input type="hidden" id="id" name="id" value={movie.id} />

                <div className="mb-3">
                    <Input title="Title"
                        className="form-control"
                        name="title"
                        value={movie.title}
                        onChange={handleChange("title")}
                        errorDiv={hasError("title") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a title"}
                    />
                </div>
                <div className="text-danger">{error}</div>      
            </form>
        </div>
    )
}
export default EditMovie;