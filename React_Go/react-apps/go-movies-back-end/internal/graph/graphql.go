package graph

import (
	"backend/internal/models"

	"github.com/graphql-go/graphql"
)

type Graph struct {
	Movies      []*models.Movie
	QueryString string
	Config      graphql.SchemaConfig
	fields      graphql.Fields
	movieType   *graphql.Object
}

func New(movies []*models.Movie) *Graph {
	var movieType = graphql.NewObject(graphql.ObjectConfig{
		Name: "Movie",
		Fields: graphql.Fields{
			"id":           &graphql.Field{Type: graphql.Int},
			"title":        &graphql.Field{Type: graphql.String},
			"description":  &graphql.Field{Type: graphql.String},
			"release_date": &graphql.Field{Type: graphql.DateTime},
			"runtime":      &graphql.Field{Type: graphql.Int},
			"mpaa_rating":  &graphql.Field{Type: graphql.String},
			"created_at":   &graphql.Field{Type: graphql.DateTime},
			"updated_at":   &graphql.Field{Type: graphql.DateTime},
			"image":        &graphql.Field{Type: graphql.String},
		},
	})

	g := &Graph{
		Movies: movies,
	}

	g.movieType = g.createMovieType()
	g.fields = g.createFields()
	g.Config = g.createSchemaConfig()

	return g
}
