export class SeriesService {
    API_KEY = 'c61e6ec54f1cfaee1dd38a2538311fb5';
    BASE_URL = 'https://api.themoviedb.org/3/tv';
    DEFAULT_LANGUAGE = 'en-US';
    cache = {};
    async getPopularSeries(page = 1) {
        const url = `${this.BASE_URL}/popular?language=${this.DEFAULT_LANGUAGE}&page=${page}&api_key=${this.API_KEY}`;
        const response = await fetch(url);
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    }
    async getTopRatedSeries(page = 1) {
        const cacheKey = `top_rated_series_${page}`;
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }
        const url = `${this.BASE_URL}/top_rated?language=${this.DEFAULT_LANGUAGE}&page=${page}&api_key=${this.API_KEY}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.cache[cacheKey] = data.results;
            return data.results;
        }
        catch (error) {
            console.error('Error fetching top rated series:', error);
            throw error;
        }
    }
    async getSeriesDetails(id) {
        const cacheKey = `series_${id}`;
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }
        const url = `${this.BASE_URL}/${id}?language=${this.DEFAULT_LANGUAGE}&api_key=${this.API_KEY}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.cache[cacheKey] = data;
            return data;
        }
        catch (error) {
            console.error(`Error fetching details for series ${id}:`, error);
            throw error;
        }
    }
    static async navigateToSeriesDetails(seriesId) {
        try {
            if (!seriesId) {
                throw new Error('Invalid series ID');
            }
            const navigationState = {
                seriesId,
                timestamp: Date.now(),
                referrer: window.location.href,
                source: 'series-list'
            };
            localStorage.setItem('seriesNavigationState', JSON.stringify(navigationState));
            window.location.href = `Series/details.html?id=${seriesId}`;
        }
        catch (error) {
            console.error('Error navigating to series details:', error);
            // Implement user feedback here
            throw error;
        }
    }
    clearCache() {
        this.cache = {};
        if (typeof localStorage !== 'undefined') {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('seriesCache_')) {
                    localStorage.removeItem(key);
                }
            });
        }
    }
}
// Singleton instance export
export const seriesService = new SeriesService();
