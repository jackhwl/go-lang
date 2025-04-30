package main

import (
	"fmt"
	"net/http"
	"time"
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
	c := make(chan string)

	for _, link := range links {
		go checkLink(link, c)
	}

	for l := range c {
		go func() {
			time.Sleep(5 * time.Second)
			checkLink(l, c)
		}()
	}
}

func checkLink(link string, c chan string) {
	_, err := http.Get(link)
	if err != nil {
		fmt.Println(link, "might be down!")
		c <- link
		return
	}

	fmt.Println(link, "is up!")
	c <- link
}
