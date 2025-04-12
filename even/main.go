package main

import "fmt"

func main() {
	eoInts := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

	for _, i := range eoInts {
		if i%2 == 0 {
			fmt.Printf("%v is even\n", i)
		} else {
			fmt.Println(i, "is odd")
		}
	}
}
