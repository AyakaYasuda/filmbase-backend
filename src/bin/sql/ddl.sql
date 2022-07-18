CREATE TABLE IF NOT EXISTS members(
    member_id serial,
    email text,
    password text,
    favorite_movies int[],
    UNIQUE(member_id)
);

CREATE TABLE IF NOT EXISTS movies(
    movie_id int,
    image_path text,
    title character varying(50),
    overview text,
    release_date date,
    vote real,
    UNIQUE(movie_id)
);

CREATE TABLE IF NOT EXISTS reviews(
    review_id serial,
    reviewer character varying(50),
    reviewer_id int,
    movie_id int,
    rate real,
    comment text,
    foreign key (reviewer_id) references members(member_id),
    foreign key (movie_id) references movies(movie_id),
    UNIQUE(review_id)
);

CREATE TABLE IF NOT EXISTS likes(
    member int,
    review int,
    foreign key (member) references members(member_id),
    foreign key (review) references reviews(review_id)
);
