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
  
  export interface Genre {
    id: number;
    name: string;
  }
  
  export interface Network {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }
  
  export interface SpokenLanguage {
    english_name: string;
    iso_639_1: string;
    name: string;
  }
  
  export interface ProductionCountry {
    iso_3166_1: string;
    name: string;
  }
  
  export interface Season {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
  }
  
  export interface SeriesDetails extends Omit<Series, 'genre_ids'> {
    created_by: any[]; // optionally define this if needed
    episode_run_time: number[];
    genres: Genre[];
    homepage: string;
    in_production: boolean;
    languages: string[];
    last_air_date: string;
    last_episode_to_air: any; // define type if needed
    next_episode_to_air: any | null;
    networks: Network[];
    number_of_episodes: number;
    number_of_seasons: number;
    production_companies: any[]; // define if needed
    production_countries: ProductionCountry[];
    seasons: Season[];
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string;
    type: string;
  }
  
  export interface SeriesApiResponse {
    page: number;
    results: Series[];
    total_pages: number;
    total_results: number;
  }
  