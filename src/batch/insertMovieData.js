require('dotenv').config();
const axios = require('axios');
const pool = require('../db');

const API_KEY = process.env.MOVIE_DB_API_KEY;

const fetchPopularMovies = async () => {
  return axios
    .get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
    .then((res) => res.data);
};

const getAllMovies = async (client) => {
  return client
    .query(
      `
        SELECT
            *
        FROM
            movies`
    )
    .then((res) => res.rows)
    .catch((err) => {
      console.log(err);
    });
};

const filterOutExistingMovies = async (client) => {
  try {
    // fetch movies stored in database.
    const storedMovies = await getAllMovies(client);

    // fetch movie data from The Movie Database API
    const { results } = await fetchPopularMovies();

    const moviesMap = new Map();
    for (const movie of storedMovies) {
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
  console.log(`########### Started Insert Movie Data Batch ###########`);
  const client = await pool.connect();
  try {
    const filteredMovie = await filterOutExistingMovies(client);
    if (filteredMovie.length === 0) {
      console.log('No new data found');
      return;
    }

    await client.query('BEGIN');
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
    console.log('Rollback transaction');
  } finally {
    client.release();
    console.log('########### Insert movie data finish ###########');
  }
};

insertMovieData();
