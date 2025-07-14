// Scripts/src/allmovies.ts
import { movieService } from "./moviesOperations.js";
export class AllMoviesPage {
    moviesContent;
    loadingSpinner;
    paginationContainer;
    currentPage = 1;
    totalPages = 1;
    constructor() {
        this.moviesContent = document.getElementById('movies-content');
        this.loadingSpinner = document.querySelector('.loading-spinner');
        this.paginationContainer = document.getElementById('pagination');
        if (!this.moviesContent || !this.loadingSpinner || !this.paginationContainer) {
            throw new Error("Required DOM elements not found");
        }
        // Get page from URL or default to 1
        const urlParams = new URLSearchParams(window.location.search);
        this.currentPage = parseInt(urlParams.get('page') || '1');
        this.setupNavbar();
        this.loadMovies(this.currentPage);
    }
    async loadMovies(page) {
        this.showLoading(true);
        try {
            const response = await movieService.getPopularMovies(page);
            // Check if response contains valid data
            if (!response || !response.results || !Array.isArray(response.results)) {
                throw new Error("Invalid API response structure");
            }
            this.renderMovies(response.results);
            this.totalPages = Math.min(response.total_pages, 500); // API limits to 500 pages
            this.renderPagination();
            // Update URL without reload
            window.history.pushState({}, '', `popularMovies.html?page=${page}`);
        }
        catch (error) {
            console.error('Error loading movies:', error);
        }
        finally {
            this.showLoading(false);
        }
    }
    renderMovies(movies) {
        if (!Array.isArray(movies)) {
            console.error('Invalid movies data:', movies);
            this.showError(new Error('Received invalid movies data'));
            return;
        }
        this.moviesContent.innerHTML = '';
        movies.forEach(movie => {
            // Validate movie object
            if (!movie || typeof movie !== 'object') {
                console.warn('Invalid movie item:', movie);
                return;
            }
            const card = document.createElement('div');
            card.className = 'col';
            const title = movie.title || 'Untitled Movie';
            const releaseDate = movie.release_date || '';
            const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
            const posterPath = movie.poster_path || '';
            const poster = posterPath
                ? `https://image.tmdb.org/t/p/w500${posterPath}`
                : 'placeholder.jpg';
            const overview = movie.overview || 'No overview available';
            const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
            card.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${poster}" class="card-img-top" alt="${title}" loading="lazy">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${overview.slice(0, 100)}${overview.length > 100 ? '...' : ''}</p>
                    </div>
                    <div class="card-footer bg-transparent">
                        <small class="text-muted">${year} • ⭐ ${voteAverage}</small>
                    </div>
                </div>
            `;
            card.addEventListener('click', () => {
                if (movie.id) {
                    window.location.href = `../Movies/details.html?id=${movie.id}`;
                }
            });
            this.moviesContent.appendChild(card);
        });
    }
    renderPagination() {
        this.paginationContainer.innerHTML = '';
        // Previous Button
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${this.currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous">&laquo;</a>`;
        prevLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadMovies(this.currentPage);
            }
        });
        this.paginationContainer.appendChild(prevLi);
        // Page Numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.totalPages, this.currentPage + 2);
        for (let i = startPage; i <= endPage; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${i === this.currentPage ? 'active' : ''}`;
            pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageLi.addEventListener('click', (e) => {
                e.preventDefault();
                this.currentPage = i;
                this.loadMovies(this.currentPage);
            });
            this.paginationContainer.appendChild(pageLi);
        }
        // Next Button
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${this.currentPage === this.totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next">&raquo;</a>`;
        nextLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.loadMovies(this.currentPage);
            }
        });
        this.paginationContainer.appendChild(nextLi);
    }
    showLoading(show) {
        this.loadingSpinner.style.display = show ? 'block' : 'none';
        this.moviesContent.style.opacity = show ? '0.5' : '1';
    }
    showError(error) {
        this.moviesContent.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger">
                    ${error.message || 'Failed to load movies.'}
                    <button class="btn btn-sm btn-outline-danger ms-3" id="retry-btn">Retry</button>
                </div>
            </div>
        `;
        document.getElementById('retry-btn')?.addEventListener('click', () => {
            this.loadMovies(this.currentPage);
        });
    }
    setupNavbar() {
        // Highlight active nav item
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector('.nav-link[href="popularMovies.html"]')?.classList.add('active');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    try {
        new AllMoviesPage();
    }
    catch (error) {
        console.error("Failed to initialize AllMoviesPage:", error);
        const errorElement = document.createElement('div');
        errorElement.className = 'alert alert-danger m-3';
        errorElement.textContent = 'Failed to initialize movies page. Please refresh.';
        document.body.prepend(errorElement);
    }
});
