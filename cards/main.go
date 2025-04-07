package main

func main() {
	cards := deck{"Ace of Diamonds", newCard()}
	cards = append(cards, "Five of Diamonds")

	cards.print()
}

func newCard() string {
	return "Six of Spades"
}
