# Filmbase - backend

This is an implementation of REST APIs for [Filmbase](https://github.com/AyakaYasuda/filmbase-frontend) in Node.js with Express. Authenticates users with a username and password using Passport. The endpoints are secured using a JSON web token. 

## Database

PostgreSQL


## Endpoints

### members
- POST /api/members/signup - creates a new user's account
- POST /api/members/login - logs a user into the app
- GET /api/members/ - gets all users
- GET /api/members/{id} - gets a user by the provided id
- POST /api/members/{id}/favorite - gets a user's favorite movies
- PUT /api/members/movie/add/{id} - adds a movie to a user's favorite list
- PUT /api/members/movie/remove/{id} - removes a movie from a user's favorite list

### movies
- GET /api/movies/ - gets all movies
- GET /api/movies/{id} - gets a movie by the provided id
- POST /api/movies/ - creates a new movie

### reviews
- GET /api/reviews/ - gets all reviews
- GET /api/reviews/{id} - gets a review by the provided review id
- GET /api/reviews/member/{id} - gets a user's reviews by the provided user id
- POST /api/reviews/member/{id} - creates a user's new review
- PUT /api/reviews/{id} - updates a review with the provided review id
- DELETE /api/reviews/{id} - deletes a review with the provided review id

### likes
- GET /api/likes/member/{id} - gets reviews that a user with the provided id liked
- GET /api/likes/{id} - gets users who liked the review with the provided id
- POST /api/likes/member/{id} - gets a movie liked by a user
- DELETE /api/likes/member/{uid}/{rid} - gets a movie not-liked by a user