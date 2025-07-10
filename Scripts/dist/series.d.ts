export interface Series {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    name: string;
    original_language: string;
    original_name: string;
    overview: string;
    poster_path: string | null;
    popularity: number;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    origin_country: string[];
}
export interface SeriesApiResponse {
    page: number;
    results: Series[];
    total_pages: number;
    total_results: number;
}
export declare class SeriesService {
    private readonly API_KEY;
    private BASE_URL;
    getPopularSeries(page?: number): Promise<Series[]>;
    getTopRatedSeries(page?: number): Promise<Series[]>;
}
//# sourceMappingURL=series.d.ts.map