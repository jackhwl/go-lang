package main

import "fmt"

func main() {
	// var colors map[string]string

	// colors := make(map[int]string)
	// colors[0] = "red"
	// delete(colors, 0)

	colors := map[string]string{
		"red":   "#FF0000",
		"green": "#00FF00",
		"blue":  "#0000FF",
	}

	printMap(colors)
}

func printMap(c map[string]string) {
	for color, hex := range c {
		fmt.Println("Hex code for", color, "is", hex)
	}
}
