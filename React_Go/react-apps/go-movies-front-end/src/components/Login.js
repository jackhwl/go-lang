import { useState } from "react";
import Input from "./form/Input";
import { useNavigate, useOutletContext } from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { setJwtToken } = useOutletContext();
    const { setAlertMessage, setAlertClassName , toggleRefresh} = useOutletContext();

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log("Login submitted", email, password);
        
        // if (email === "admin@jack.com") {
        //     setJwtToken("abc");
        //     setAlertClassName("d-none");
        //     setAlertMessage("");
        //     navigate("/");
        // } else {
        //     setAlertClassName("alert-danger");
        //     setAlertMessage("Invalid email or password");
        // }

        // build request payload
        let payload = {
            email: email,
            password: password
        };
console.log("Login submitted", payload);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
        };

        fetch(`/authenticate`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { console.log('aaa==============='); throw err });
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    setAlertClassName("alert-danger");
                    setAlertMessage(data.error.message);
                } else {
                    setJwtToken(data.access_token);
                    setAlertClassName("d-none");
                    setAlertMessage("");
                    toggleRefresh(true);
                    navigate("/");
                }
            })
            .catch(error => {
                setAlertClassName("alert-danger");
                setAlertMessage(error.message);
            });
    }

    return (
        <div className="col-md-6 offset-md-3">
            <h2>Login!</h2>
            <hr />
            <form onSubmit={handleSubmit}>
                <Input
                    title="Email Address"
                    type="email"
                    className="form-control"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email-new"
                />

                <Input
                    title="Password"
                    type="password"
                    className="form-control"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="password-new"
                />

                <hr />
                <input type="submit" className="btn btn-primary" value="Login" />

            </form>
        </div>
    )
}
export default Login;