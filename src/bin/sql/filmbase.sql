-- createdb -U postgres filmbasedb
-- psql -U postgres filmbasedb < filmbase.sql

CREATE TABLE members(
    member_id serial,
    name character varying(50),
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
    reviewer int,
    movie int,
    rate real,
    review_comment text
);

CREATE TABLE likes(
    member character varying(50),
    review int
);

INSERT INTO members(name, email, password, favorite_movies) 
VALUES ('testuser', 'testuser@test.com', 'password', '{12345}');

INSERT INTO movies(image_path, title, overview, release_date, vote)
VALUES
('https://i.pinimg.com/originals/4f/e0/5c/4fe05c0a2d170a2261e6501618f913bd.png', 'Frozen', 'The film depicts a princess who sets off on a journey alongside an iceman, his reindeer, and a snowman to find her estranged sister, whose icy powers have inadvertently trapped their kingdom in eternal winter.', '2013-11-27', 3.8);

INSERT INTO reviews(reviewer, movie, rate, review_comment)
VALUES
(00001, 12345, 4.5, 'It is genuinely a delightful experience; full of memorable songs and fun moments & lots of dry humour.');

INSERT INTO likes(member, review)
VALUES
('another-testuser', 10000);