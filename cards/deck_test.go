package main

import (
	"os"
	"testing"
)

func TestNewDeck(t *testing.T) {
	d := newDeck()
	if len(d) != 52 {
		t.Errorf("Expected deck length of 52, but got %v", len(d))
	}
	if d[0] != "Ace of Diamonds" {
		t.Errorf("Expected first card to be Ace of Diamonds, but got %v", d[0])
	}
	if d[len(d)-1] != "King of Clubs" {
		t.Errorf("Expected last card to be King of Clubs, but got %v", d[len(d)-1])
	}
}

func TestSaveToFileAndNewDeckFromFile(t *testing.T) {
	os.Remove("_decktesting")

	d := newDeck()
	err := d.saveToFile("_decktesting")
	if err != nil {
		t.Errorf("Error saving to file: %v", err)
	}
	d2 := newDeckFromFile("_decktesting")
	if len(d2) != 52 {
		t.Errorf("Expected deck length of 52, but got %v", len(d2))
	}
	if d2[0] != "Ace of Diamonds" {
		t.Errorf("Expected first card to be Ace of Diamonds, but got %v", d2[0])
	}
	if d2[len(d2)-1] != "King of Clubs" {
		t.Errorf("Expected last card to be King of Clubs, but got %v", d2[len(d2)-1])
	}
	// Clean up the test file
	err = os.Remove("_decktesting")
	if err != nil {
		t.Errorf("Error removing test file: %v", err)
	}
}
