-- createdb -U postgres filmbasedb
-- psql -U postgres filmbasedb < filmbase.sql

INSERT INTO members(name, email, password, favorite_movies) 
VALUES ('testuser', 'testuser@test.com', 'password', '{123456}');
    
INSERT INTO movies(movie_id, image_path, title, overview, release_date, vote)
VALUES
(12345, 'https://i.pinimg.com/originals/4f/e0/5c/4fe05c0a2d170a2261e6501618f913bd.png', 'Frozen', 'The film depicts a princess who sets off on a journey alongside an iceman, his reindeer, and a snowman to find her estranged sister, whose icy powers have inadvertently trapped their kingdom in eternal winter.', '2013-11-27', 3.8);

INSERT INTO reviews(reviewer_id, movie_id, rate, comment)
VALUES
(1, 12345, 4.5, 'It is genuinely a delightful experience; full of memorable songs and fun moments & lots of dry humour.');

INSERT INTO likes(member, review)
VALUES
(1, 1);