export class MovieService {
    API_KEY = 'c61e6ec54f1cfaee1dd38a2538311fb5'; // Replace with your real key
    BASE_URL = '';
    async getPopularMovies(page = 1) {
        this.BASE_URL = 'https://api.themoviedb.org/3/movie';
        const url = `${this.BASE_URL}/popular?language=en-US&page=${page}&api_key=${this.API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results;
    }
    ;
    async getTopRatedMovies(page = 1) {
        this.BASE_URL = 'https://api.themoviedb.org/3/movie';
        const url = `${this.BASE_URL}/top_rated?language=en-US&page=${page}&api_key=${this.API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results;
    }
    async getMovieDetails(id) {
        this.BASE_URL = 'https://api.themoviedb.org/3/movie';
        const url = `${this.BASE_URL}/${id}?language=en-US&api_key=${this.API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results;
    }
}
//# sourceMappingURL=movies.js.map