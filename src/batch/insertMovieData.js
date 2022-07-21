const fetch = require('node-fetch');

require('dotenv').config();

const API_KEY = process.env.MOVIE_DB_API_KEY;
const pool = require('../db');

const fetchPopularMovies = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
  );
  return response.json();
};

const getAllMovies = async (client) => {
  return client
    .query(
      `SELECT
                *
            FROM
                movies`
    )
    .then((res) => res.rows)
    .catch((err) => {
      console.log(err);
    });
};

const getFilteredMovies = async (client) => {
  try {
    const movies = await getAllMovies(client);
    const { results } = await fetchPopularMovies();

    const moviesMap = new Map();
    for (const movie of movies) {
      moviesMap.set(movie.movie_id, true);
    }

    return results.filter((movie) => !moviesMap.has(movie.id));
  } catch (err) {
    console.log(err);
  }
};

const createMovie = (client, movieData) => {
  const { id, poster_path, title, overview, release_date, vote_average } =
    movieData;
  client
    .query(
      `INSERT INTO movies
        (movie_id, image_path, title, overview, release_date, vote) 
       VALUES
        ($1, $2, $3, $4, $5, $6)`,
      [id, poster_path, title, overview, release_date, vote_average]
    )
    .catch((err) => {
      console.log(err);
    });
};

const insertMovieData = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const filteredMovie = await getFilteredMovies(client);
    for (const movie of filteredMovie) {
      await createMovie(client, movie);
    }
    await client.query('COMMIT');
    console.log(
      `########### Inserted ${filteredMovie.length} rows successfully ###########`
    );
  } catch (ex) {
    console.log(ex);
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
};

insertMovieData();
