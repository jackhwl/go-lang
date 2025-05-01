package main

import "fmt"

type contactInfo struct {
	email   string
	zipCode int
}

type person struct {
	firstName string
	lastName  string
	contactInfo
}

func main() {
	// alex := person{
	// 	firstName: "Alex",
	// 	lastName:  "Anderson",
	// }

	// var alex person
	// alex.firstName = "Alex"
	// alex.lastName = "Anderson"

	// fmt.Println(alex)
	// fmt.Printf("%+v", alex)

	jim := person{
		firstName: "Jim",
		lastName:  "Party",
		contactInfo: contactInfo{
			email:   "jim@gmail.com",
			zipCode: 12345,
		},
	}

	// fmt.Println(jim)
	// fmt.Printf("%+v", jim)

	jim.print()

	//jimPointer := &jim
	jim.updateName("Jimmy")
	//jim.updateName("Jimmy")
	jim.print()
}

func (p person) print() {
	fmt.Printf("%+v", p)
}

func (p *person) updateName(firstName string) {
	(*p).firstName = firstName
}
