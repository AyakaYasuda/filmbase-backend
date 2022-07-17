-- createdb -U postgres filmbasedb
-- psql -U postgres filmbasedb < filmbase.sql

CREATE TABLE members(
    member_id serial,
    email text,
    password text,
    favorite_movies int[]
);

CREATE TABLE movies(
    movie_id serial,
    image_path text,
    title character varying(50),
    overview text,
    release_date date,
    vote real
);

CREATE TABLE reviews(
    review_id serial,
    reviewer character varying(50),
    reviewer_id int,
    movie_id int,
    rate real,
    comment text
);

CREATE TABLE likes(
    member int,
    review int
);

INSERT INTO members(email, password, favorite_movies) 
VALUES ('testuser@test.com', 'password', '{12345}');

INSERT INTO movies(image_path, title, overview, release_date, vote)
VALUES
('https://i.pinimg.com/originals/4f/e0/5c/4fe05c0a2d170a2261e6501618f913bd.png', 'Frozen', 'The film depicts a princess who sets off on a journey alongside an iceman, his reindeer, and a snowman to find her estranged sister, whose icy powers have inadvertently trapped their kingdom in eternal winter.', '2013-11-27', 3.8);

INSERT INTO reviews(reviewer, reviewer_id, movie_id, rate, comment)
VALUES
('testuser', 1, 1, 4.5, 'It is genuinely a delightful experience; full of memorable songs and fun moments & lots of dry humour.');

INSERT INTO likes(member, review)
VALUES
(1, 1);