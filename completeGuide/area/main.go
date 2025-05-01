package main

import "fmt"

type triangle struct {
	base   float64
	height float64
}
type square struct {
	side float64
}

type shape interface {
	getArea() float64
}

func (t triangle) getArea() float64 {
	return 0.5 * t.base * t.height
}

func (s square) getArea() float64 {
	return s.side * s.side
}

func printArea(s shape) {
	area := s.getArea()
	switch s.(type) {
	case triangle:
		fmt.Println("Triangle area:", area)
	case square:
		fmt.Println("Square area:", area)
	default:
		fmt.Println("Unknown shape")
	}
}

func main() {
	t := triangle{base: 10, height: 5}
	s := square{side: 4}

	printArea(t)
	printArea(s)
}
