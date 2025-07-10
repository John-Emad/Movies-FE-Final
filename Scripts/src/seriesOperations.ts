import { Series, SeriesDetails, SeriesApiResponse } from './SeriesInterface';

  export class SeriesService {
    private readonly API_KEY = 'c61e6ec54f1cfaee1dd38a2538311fb5'; // Replace with your real key
    private BASE_URL = '';
  
    async getPopularSeries(page: number = 1): Promise<Series[]> {
    this.BASE_URL = 'https://api.themoviedb.org/3/tv';
      const url = `${this.BASE_URL}/popular?language=en-US&page=${page}&api_key=${this.API_KEY}`;

  
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.results as Series[];
    };

    async getTopRatedSeries(page: number = 1): Promise<Series[]> {
        this.BASE_URL = 'https://api.themoviedb.org/3/tv';
        const url = `${this.BASE_URL}/top_rated?language=en-US&page=${page}&api_key=${this.API_KEY}`;
      
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        const data = await response.json();
        return data.results as Series[];
      }

      async getSeriesDetails(id: number): Promise<SeriesDetails> {
        const url = `${this.BASE_URL}/${id}?language=en-US&api_key=${this.API_KEY}`;
    
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data: SeriesDetails = await response.json();
        return data;
      }
      
  }