export interface BaseMovie {
    adult: boolean;
    backdrop_path: string | null;
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

  export interface MovieSummary {
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

  export interface Genre {
    id: number;
    name: string;
  }
  
  export interface SpokenLanguage {
    english_name: string;
    iso_639_1: string;
    name: string;
  }
  
  export interface ProductionCompany {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }
  
  export interface ProductionCountry {
    iso_3166_1: string;
    name: string;
  }
  
  export interface Collection {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  }
  
  export interface MovieDetails extends Omit<MovieSummary, 'genre_ids'> {
    genres: Genre[];
    budget: number;
    revenue: number;
    runtime: number;
    status: string;
    imdb_id: string;
    homepage: string;
    tagline: string;
    spoken_languages: SpokenLanguage[];
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    belongs_to_collection?: Collection;
  }
  
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
  
  export  interface MovieApiResponse {
    page: number;
    results: MovieSummary[];
    total_pages: number;
    total_results: number;
  }