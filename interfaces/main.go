package main

import "fmt"

type bot interface {
	getGreeting() string
}

type englishBot struct{}
type spanishBot struct{}

func main() {
	eb := englishBot{}
	sb := spanishBot{}

	printGreeting(eb)
	printGreeting(sb)

	// fmt.Println(eb.getGreeting())
	// fmt.Println(sb.getGreeting())
}

func printGreeting(b bot) {
	fmt.Println(b.getGreeting())
}

// func printGreeting(sb spanishBot) {
// 	fmt.println(sb.getGreeting())
// }

func (englishBot) getGreeting() string {
	return "Hello!"
}
func (spanishBot) getGreeting() string {
	return "Hola!"
}
