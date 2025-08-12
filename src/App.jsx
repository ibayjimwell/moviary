import { useState, useEffect } from 'react'
import Search from './components/Search'
import { Loader } from './components/Loader';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from './appwrite';
import Modal from "./components/Modal.jsx";
import Request from './request.js'; // API static variables

// Main App Component
const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
 
  const [trendingMovies, setTrendingMovies] = useState([]);

  // Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 1000ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm])
  
  // States for Pop-up Modal Component
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movieCardClickedId, setMovieCardClickedId] = useState();
  const [isMovieCardClicked, setIsMovieCardClicked] = useState(false);
  const [movieInfo, setMovieInfo] = useState({}); // The fetches info of the movie
  const [isModalLoading, setIsModalLoading] = useState(true);

  // Movie Card Clicked Handler
  const handleMovieCardClicked = (id) => {
    setIsMovieCardClicked(true);
    setMovieCardClickedId(id);
  }

  // Trigger to the modal loader
  useEffect(() => {
    if (Object.keys(movieInfo).length > 0) {
      setIsModalLoading(false);
    } else {
      setIsModalLoading(true);
    }
  }, [movieInfo]);

  // Fetching the info of the clicked movie card
  useEffect(() => {
      const fetchMovieInfo = async () => {

        if (isMovieCardClicked) {
          setMovieInfo({});
          setIsModalOpen(true);

          try {
            const endpoint = `${Request.apiMovieDiscoverUrl}/movie/${movieCardClickedId}`;
            const response = await fetch(endpoint, Request.API_OPTIONS_GET);

            if (!response.ok) {
              throw new Error('Failed to fetch movie details.')
            }

            const data = await response.json();
            setMovieInfo(data);
            
          } catch (error) {
            console.log(`Error fetching movie details: ${error}`);
            setErrorMessage('Error loading movie details. Please try again later.');
            setMovieInfo({})
          }

        } else {
          setIsModalOpen(false);
        }
      };
      fetchMovieInfo();
  }, [isMovieCardClicked]);

  // Fetching the list of the movies
  useEffect(() => {
    const fetchMovies = async (query = '') => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const endpoint = query 
        ? `${Request.apiMovieDiscoverUrl}/search/movie?query=${encodeURIComponent(query)}`
        : `${Request.apiMovieDiscoverUrl}/discover/movie?sort_by*popularity.desc`;
        const response = await fetch(endpoint, Request.API_OPTIONS_GET);

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

        if (query && data.results.length > 0) {
          await updateSearchCount(query, data.results[0])
        }

      } catch (error) {
        console.log(`Error fetching movies: ${error}`);
        setErrorMessage('Error discovering movies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Getting the trending movies from the appwrite.js
  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        const movies = await getTrendingMovies();
        setTrendingMovies(movies)
      } catch (error) {
        console.log(`Error fetching trending movies: ${error}`)
      }
    }
    loadTrendingMovies()
  }, []);
 
  return (
    <>

      { isModalOpen && <Modal setIsMovieCardClicked={setIsMovieCardClicked} isModalLoading={isModalLoading} details={movieInfo} ></Modal> }

      <main>
        <div className='pattern'></div>

        <div className='wrapper'>
          <header>
            <div className='flex justify-center items-center'>
              <img className='w-1/6 md:w-1/12' src='./logo.svg' alt='Moviary Logo'/>
            </div>
            <img src="./hero.png" alt="Movies Banner" />
            <h1>Your Personal <span className='text-gradient'>Movie Diary</span> Anytime Anywhere</h1>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}></Search>
          </header>

          {trendingMovies.length > 0 && (
            <section className='trending'>
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.searchTerm} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className='all-movies'>
            <h2>All Movies</h2>

            {
              isLoading ? 
              (<Loader></Loader>) :
              errorMessage ? (<p className='text-red-500'>{errorMessage}</p>) :
              (
                <ul>
                  {movieList.map((movie) => (
                      <li className='cursor-pointer' onClick={() => handleMovieCardClicked(movie.id)} key={movie.id}>
                          <MovieCard movie={movie}></MovieCard>
                      </li>
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