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
	fmt.Println(scores[0].name, ":", scores[0].score)
	fmt.Println(scores[1].name, ":", scores[1].score)
	fmt.Println(scores[2].name, ":", scores[2].score)

}
