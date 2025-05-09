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
	// students := []string{"Dent, Author",
	// 	"Smith, John",
	// 	"Jones, Mary",
	// }
	// scores := []int{87, 92, 78}
	type score struct {
		name  string
		score int
	}
	scores := []score{
		{"Dent, Authur", 87},
		{"Smith, John", 92},
		{"Jones, Mary", 78},
	}

	fmt.Println("Selectt score to print(1 - 3):")
	var option string
	fmt.Scanln(&option)
	// fmt.Println("Student scores")
	// fmt.Println(strings.Repeat("-", 14))
	// for _, s := range scores {
	// 	fmt.Println(s.name, ":", s.score)
	// }
	// // students := [3]string{"Dent, Authur",
	// 	students[0]: 87,
	// 	students[1]: 92,
	// 	students[2]: 78,
	// }

	fmt.Println("Student scores")
	fmt.Println(strings.Repeat("-", 14))
	var index int
	// if option == "1" {
	// 	index = 0
	// } else if option == "2" {
	// 	index = 1
	// } else if option == "3" {
	// 	index = 2
	// } else {
	// 	fmt.Println("Invalid option, defaulting to 1")
	// 	index = 0
	// }
	switch option {
	case "1":
		index = 0
	case "2":
		index = 1
	case "3":
		index = 2
	default:
		fmt.Println("Invalid option, defaulting to 1")
		index = 0
	}
	fmt.Println(scores[index].name, ":", scores[index].score)
	// fmt.Println(scores[1].name, ":", scores[1].score)
	// fmt.Println(scores[2].name, ":", scores[2].score)

}
