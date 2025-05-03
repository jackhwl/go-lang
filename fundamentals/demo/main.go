package main

import (
	"fmt"
	"strings"
)

func main() {
	// var name string = "Dent, Authur"
	// var score = 87
	// name := "Dent, Authur"
	// score := 87
	name, score := "Dent, Authur", 87

	fmt.Println("Student scores")
	fmt.Println(strings.Repeat("-", 14))
	fmt.Println(name, score)
}
