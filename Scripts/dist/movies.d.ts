export interface Movie {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}
export interface MovieApiResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}
export declare class MovieService {
    private readonly API_KEY;
    private BASE_URL;
    getPopularMovies(page?: number): Promise<Movie[]>;
    getTopRatedMovies(page?: number): Promise<Movie[]>;
    getMovieDetails(id: number): Promise<Movie[]>;
}
//# sourceMappingURL=movies.d.ts.map