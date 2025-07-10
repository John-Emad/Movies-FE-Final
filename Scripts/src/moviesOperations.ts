import { MovieSummary, MovieDetails, MovieApiResponse } from './MovieInterface';

  
  export class MovieService {
    private readonly API_KEY = 'c61e6ec54f1cfaee1dd38a2538311fb5'; // Replace with your real key
    private BASE_URL = '';
  
    async getPopularMovies(page: number = 1): Promise<MovieSummary[]> {
    this.BASE_URL = 'https://api.themoviedb.org/3/movie';
      const url = `${this.BASE_URL}/popular?language=en-US&page=${page}&api_key=${this.API_KEY}`;

  
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.results as MovieSummary[];
    };

    async getTopRatedMovies(page: number = 1): Promise<MovieSummary[]> {
        this.BASE_URL = 'https://api.themoviedb.org/3/movie';
        const url = `${this.BASE_URL}/top_rated?language=en-US&page=${page}&api_key=${this.API_KEY}`;
      
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        const data = await response.json();
        return data.results as MovieSummary[];
      }
      
      async getMovieDetails(id: number): Promise<MovieDetails> {
        this.BASE_URL = 'https://api.themoviedb.org/3/movie';
        const url = `${this.BASE_URL}/${id}?language=en-US&api_key=${this.API_KEY}`;
      
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        const data = await response.json();
        return data.results as MovieDetails;
      }
  }
  