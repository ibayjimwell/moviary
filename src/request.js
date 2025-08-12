
// Class for requesting in the API
class Request{
    static apiKey = import.meta.env.VITE_TMDB_API_KEY;
    static apiMovieDiscoverUrl = import.meta.env.VITE_TMDB_MOVIE_DISCOVER_URL;
    
    static API_OPTIONS_GET = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      }
    };
}

export default Request;