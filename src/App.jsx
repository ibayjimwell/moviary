import React, { useState, useEffect } from 'react'
import Search from './components/Search'
import { Loader } from './components/Loader';
import MovieCard from './components/MovieCard';

// API Credentials
const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const apiMovieDiscoverUrl = import.meta.env.VITE_TMDB_MOVIE_DISCOVER_URL;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const endpoint = `${apiMovieDiscoverUrl}?sort_by*popularity.desc`;
        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) {
          throw new Error('Failed to fetch movies.')
        }

        const data = await response.json();
        if (data.Response == "False") {
          setErrorMessage(data.Error || 'Failed to fetch movies.')
          setMovieList([])
          return;
        }

        setMovieList(data.results || []);

      } catch (error) {
        console.log(`Error fetching movies: ${error}`);
        setErrorMessage('Error discovering movies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);
 
  return (
    <>
      <main>
        <div className='pattern'></div>

        <div className='wrapper'>
          <header>
            <img src="./hero.png" alt="Movies Banner" />
            <h1>Your Personal <span className='text-gradient'>Movie Diary</span> Anytime Anywhere</h1>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}></Search>
          </header>

          <section className='all-movies mt-12'>
            <h2>All Movies</h2>

            {
              isLoading ? 
              (<Loader></Loader>) :
              errorMessage ? (<p className='text-red-500'>{errorMessage}</p>) :
              (
                <ul>
                  {movieList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie}></MovieCard>
                  ))}
                </ul>
              )
            }
          </section>

        </div>
      </main>
    </>
  )
}

export default App