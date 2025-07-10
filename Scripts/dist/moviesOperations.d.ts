import { MovieSummary, MovieDetails } from './MovieInterface';
export declare class MovieService {
    private readonly API_KEY;
    private BASE_URL;
    getPopularMovies(page?: number): Promise<MovieSummary[]>;
    getTopRatedMovies(page?: number): Promise<MovieSummary[]>;
    getMovieDetails(id: number): Promise<MovieDetails>;
}
//# sourceMappingURL=moviesOperations.d.ts.map