// Scripts/src/home.ts
import { movieService } from "./moviesOperations.js";
import { seriesService } from "./seriesOperations.js";
export class HomePage {
    moviesContent;
    seriesContent;
    loadingSpinner;
    constructor() {
        this.moviesContent = document.getElementById('movies-content');
        this.seriesContent = document.getElementById('series-content');
        this.loadingSpinner = document.querySelector('.loading-spinner');
        if (!this.moviesContent || !this.seriesContent || !this.loadingSpinner) {
            throw new Error("Required DOM elements not found");
        }
        this.setupNavbar();
        this.loadPopularContent();
    }
    showLoading(show) {
        this.loadingSpinner.style.display = show ? 'block' : 'none';
    }
    renderCards(items, container, type) {
        container.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'col';
            const title = type === 'movies'
                ? item.title
                : item.name;
            const date = type === 'movies'
                ? item.release_date
                : item.first_air_date;
            const year = date ? new Date(date).getFullYear() : 'N/A';
            const poster = item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : 'placeholder.jpg';
            card.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${poster}" class="card-img-top" alt="${title}" loading="lazy">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${item.overview?.slice(0, 100) || 'No overview available'}...</p>
                    </div>
                    <div class="card-footer bg-transparent">
                        <small class="text-muted">${year} • ⭐ ${item.vote_average?.toFixed(1) || 'N/A'}</small>
                    </div>
                </div>
            `;
            card.addEventListener('click', () => {
                this.navigateToDetails(item.id, type);
            });
            container.appendChild(card);
        });
    }
    navigateToDetails(id, type) {
        const basePath = type === 'movies' ? 'Movies' : 'Series';
        window.location.href = `${basePath}/details.html?id=${id}`;
    }
    setupNavbar() {
        // Setup navigation to dedicated pages
        const moviesLink = document.getElementById('nav-movies');
        const seriesLink = document.getElementById('nav-series');
        if (moviesLink && seriesLink) {
            moviesLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'allmovies.html';
            });
            seriesLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'allseries.html';
            });
        }
    }
    async loadPopularContent() {
        this.showLoading(true);
        try {
            const [movies, series] = await Promise.all([
                movieService.getTopRatedMovies(),
                seriesService.getTopRatedSeries()
            ]);
            this.renderCards(movies, this.moviesContent, 'movies');
            this.renderCards(series, this.seriesContent, 'series');
        }
        catch (error) {
            console.error('Error loading content:', error);
            this.showError();
        }
        finally {
            this.showLoading(false);
        }
    }
    showError() {
        const errorHtml = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger">
                    Failed to load content. Please try again later.
                    <button class="btn btn-sm btn-outline-danger ms-3" id="retry-btn">Retry</button>
                </div>
            </div>
        `;
        this.moviesContent.innerHTML = errorHtml;
        this.seriesContent.innerHTML = errorHtml;
        document.getElementById('retry-btn')?.addEventListener('click', () => {
            this.loadPopularContent();
        });
    }
}
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new HomePage();
    }
    catch (error) {
        console.error("Failed to initialize HomePage:", error);
        // Show error to user
        const errorElement = document.createElement('div');
        errorElement.className = 'alert alert-danger m-3';
        errorElement.textContent = 'Failed to initialize page. Please refresh.';
        document.body.prepend(errorElement);
    }
});
