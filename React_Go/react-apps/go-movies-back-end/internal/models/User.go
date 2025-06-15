package models

import (
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID        int       `json:"id"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}

func (u *User) PasswordMatches(plainText string) (bool, error) {
	// Check if password hash is empty
	if u.Password == "" {
		return false, errors.New("stored password hash is empty")
	}

	// Check if plainText is empty
	if plainText == "" {
		return false, errors.New("plaintext password is empty")
	}

	// Add length check for bcrypt hash (should be 60 characters)
	if len(u.Password) != 60 {
		return false, errors.New("invalid password hash format")
	}
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(plainText))
	if err != nil {
		switch {
		case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
			return false, nil // Password does not match
		default:
			return false, err
		}
	}

	return true, nil // Password matches
}
