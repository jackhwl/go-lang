package main

import (
	"fmt"
	"net/http"
)

func main() {
	links := []string{
		"https://www.google.com",
		"https://www.facebook.com",
		"https://www.twitter.com",
		"https://www.linkedin.com",
		"https://www.github.com",
		"https://www.reddit.com",
		"https://www.stackoverflow.com",
		"https://www.quora.com",
		"https://www.medium.com",
		"https://www.wikipedia.org",
		"https://www.amazon.com",
		"https://www.netflix.com",
		"https://www.youtube.com",
		"https://www.instagram.com",
		"https://www.pinterest.com",
	}

	for _, link := range links {
		checkLink(link)
	}
}

func checkLink(link string) {
	_, err := http.Get(link)
	if err != nil {
		fmt.Println(link, "might be down!")
	}

	fmt.Println(link, "is up!")

}
