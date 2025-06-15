## Introduction
  - Welcome
  - Notice for existing students
  - Mistakes, We all make them
## Setting up our development environment
  - Installing Node
  - Installing Go
  - Installing Visual Studio Code
  - Installing Docker
## Gettiong Started with React
  - How React works
  - Hello world with React using Classes
  - Hello world with React using functional
  - Styling Components
  - Using Bootstrap CSS
  - Using props: passing data to components
  - React and State I
  - React and State II
  - React and State III
  - React and State IV
  - React and State V
  - Intercepting form submissions with onSubmit()
  - handleSubmit() continued
  - Ref: using references in React
  - References with components: forwardRef()
  - Class Lifecycle
## Getting started with our main project: Go Watch a Movie
  - Getting started with our project
  - Setting up the application layout
  - Getting Started with React Router v6
  - Configuring React Router
  - Using React Router's Link
  - Working on the Movies component
  - Routing from the Movies component to individual
  - Displaying an individual movie
## Setting up User Login
  - Working on the Login button
  - Creating the login form
  - Giving the Login component access to setJWT
  - Adding error messages and redirects to the Login component
  - Logging out
## Getting started with our Back End API
  - Starting the back end API
  - Adding handlers and routes to our API
  - Installing a routing package
  - Adding a route to our handlers
  - Returning JSON from our API
  - Returning a list of movies as JSON
  - Connecting the front end to the back end API
  - Enabling CORS middleware
  - Enabling React's proxy to the back end API
## Connection to Postgres
  - Setting up our database using Docker
    - docker compose up -d
  - Getting started connection our API to Postgres
    - go get github.com/jackc/pgx/v4
  - Installing a database driver and connecting to Postgres
  - Setting up a database repository I
  - Setting up a database repository II
  - Improving the allMovies handler to use our database
## Working with JSON
  - Setting up utils.go and a writeJSON helper
  - Adding a readJSON helper function
  - Adding an errorJSON helper function
  - Using our errorJSON helper function
## Authentication with JWT
  - Installing a JWT package
    - go get github.com/golang-jwt/jwt/v4
  - Generating tokens
  - Setting default values for JWT tokens
  - Creating a handler to generate a JWT
  - Trying out our handler
  - Generate refresh token cookie
  - Reading a JSON payload in the authenticate
  - Looking up a user by email
  - Validating a password
  - Updating the Login component on the front end