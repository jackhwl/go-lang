import { useCallback, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Alert from "./components/Alert";

function App() {
  const [jwtToken, setJwtToken] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("d-none");

  const [tickInterval, setTickInterval] = useState();

  const navigate = useNavigate();

  const logout = () => {
    const requestOptions = {
      method: 'GET',
      credentials: 'include'
    };

    fetch(`/logout`, requestOptions)
    .catch(error => {
      console.error('Error during logout:', error);
    })
    .finally(() => {
      setJwtToken("");
      toggleRefresh(false);
    });

    navigate("/login");
  }

  const toggleRefresh = useCallback((status) => {
      console.log("clicked");
      if (status) {
      console.log("turning on ticking");
      let i = setInterval(() => {
        const requestOptions = {
          method: 'GET',
          credentials: 'include'
        };
        fetch(`/refresh`, requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.access_token) {
              setJwtToken(data.access_token);
            }
          })
          .catch(error => {
            console.error('user is not loogged in');
          });
      }, 1000*600);
      setTickInterval(i);
      console.log("setting ticking interval to", i);
    } else {
      console.log("turning off ticking");
      console.log("turning off tickInterval", tickInterval);
      setTickInterval(null);
      clearInterval(tickInterval);
    }
  }, [tickInterval])

  useEffect(() => {
    if (jwtToken === "") {
      const requestOptions = {
        method: 'GET',
        credentials: 'include'
      };
      fetch(`/refresh`, requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.access_token) {
            setJwtToken(data.access_token);
            toggleRefresh(true);
          }
        })
        .catch(error => {
          console.error('Error fetching JWT token:', error);
        });
    }
  }, [jwtToken, toggleRefresh]);


  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1 className="mt-3">Go Movies Front End</h1>
        </div>
        <div className="col text-end">
          { jwtToken === ""
            ? <Link to="/login"><span className="badge bg-success">Login</span></Link>
            : <a href="#!" onClick={logout}><span className="badge bg-danger">Logout</span></a>
          }
        </div>
        <hr className="mb-3" />
      </div>
      <div className="row">
        <div className="col-md-2">
          <nav>
            <div className="list-group">
              <Link to="/" className="list-group-item list-group-item-action">Home</Link>
              <Link to="/movies" className="list-group-item list-group-item-action">Movies</Link>
              <Link to="/genres" className="list-group-item list-group-item-action">Genres</Link>
              { jwtToken !== "" &&
                <> 
                  <Link to="/admin/movie/0" className="list-group-item list-group-item-action">Add Movie</Link>
                  <Link to="/manage-catalogue" className="list-group-item list-group-item-action">Manage Catalogue</Link>
                  <Link to="/graphql" className="list-group-item list-group-item-action">GraphQL</Link>
                </>
              }
            </div>
          </nav>
        </div>
        <div className="col-md-10">
          <Alert 
            message={alertMessage} 
            className={alertClassName} 
          />
          <Outlet context={{
            jwtToken,
            setJwtToken,
            setAlertMessage,
            setAlertClassName,
            toggleRefresh,
          }} />
        </div>
      </div>
    </div>
  );
}

export default App;
