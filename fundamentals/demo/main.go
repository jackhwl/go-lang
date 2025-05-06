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
	// name, score := "Dent, Authur", 87
	students := []string{"Dent, Author",
		"Smith, John",
		"Jones, Mary",
	}
	scores := []int{87, 92, 78}

	fmt.Println("Student scores")
	fmt.Println(strings.Repeat("-", 14))
	fmt.Println(students[0], ":", scores[0])
	fmt.Println(students[1], ":", scores[1])
	fmt.Println(students[2], ":", scores[2])

}
