// Get the API URL from your environment variables
// Use http://localhost:3000 during local dev
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

/**
 * Sends a POST request to update the search count for a movie.
 * The backend handles the 'upsert' logic automatically.
 */
export const updateSearchCount = async (searchTerm, movie) => {
    try {
        const response = await fetch(`${API_BASE_URL}/trending/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchTerm, movie }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error updating search count: ${error}`);
    }
};

/**
 * Fetches the top 5 trending movies from our MongoDB database.
 */
export const getTrendingMovies = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/trending/movies`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Return the data array from the response { success: true, data: [...] }
        return result.data || [];
    } catch (error) {
        console.error(`Error fetching trending movies: ${error}`);
        return [];
    }
};