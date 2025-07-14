import { MovieSummary, MovieDetails, MovieApiResponse } from './MovieInterface';

export class MovieService {
    private readonly API_KEY = 'c61e6ec54f1cfaee1dd38a2538311fb5';
    private readonly BASE_URL = 'https://api.themoviedb.org/3/movie';
    private readonly DEFAULT_LANGUAGE = 'en-US';
    private cache: Record<string, { data: any; timestamp: number }> = {};

    async getPopularMovies(page: number = 1): Promise<MovieApiResponse> {
        const url = `${this.BASE_URL}/popular?language=${this.DEFAULT_LANGUAGE}&page=${page}&api_key=${this.API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json() as MovieApiResponse;
    }


    async getTopRatedMovies(page: number = 1): Promise<MovieSummary[]> {
        const cacheKey = `top_rated_movies_${page}`;
        

        const url = `${this.BASE_URL}/top_rated?language=${this.DEFAULT_LANGUAGE}&page=${page}&api_key=${this.API_KEY}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: MovieApiResponse = await response.json();
            const cacheItem = {
                data: data.results,
                timestamp: Date.now()
            };

            this.cache[cacheKey] = cacheItem;

            return data.results;
        } catch (error) {
            console.error('Error fetching top rated movies:', error);
            throw error;
        }
    }

    async getMovieDetails(id: number): Promise<MovieDetails> {
        const cacheKey = `movie_details_${id}`;
        

        const url = `${this.BASE_URL}/${id}?language=${this.DEFAULT_LANGUAGE}&api_key=${this.API_KEY}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: MovieDetails = await response.json();
            const cacheItem = {
                data: data,
                timestamp: Date.now()
            };

            this.cache[cacheKey] = cacheItem;

            return data;
        } catch (error) {
            console.error(`Error fetching details for movie ${id}:`, error);
            throw error;
        }
    }

    static async navigateToMovieDetails(movieId: number): Promise<void> {
        try {
            if (!movieId) {
                throw new Error('Invalid movie ID');
            }

            const navigationState = {
                movieId,
                timestamp: Date.now(),
                referrer: window.location.href,
                source: 'movie-list'
            };

            localStorage.setItem('movieNavigationState', JSON.stringify(navigationState));
            window.location.href = `Movies/details.html?id=${movieId}`;
        } catch (error) {
            console.error('Error navigating to movie details:', error);
            throw error;
        }
    }

    clearCache(): void {
        this.cache = {};
        if (typeof localStorage !== 'undefined') {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('movieCache_')) {
                    localStorage.removeItem(key);
                }
            });
        }
    }

}

// Singleton instance export
export const movieService = new MovieService();