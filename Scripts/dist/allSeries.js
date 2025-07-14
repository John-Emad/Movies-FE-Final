// Scripts/src/allseries.ts
import { seriesService } from "./seriesOperations.js";
export class AllSeriesPage {
    seriesContent;
    loadingSpinner;
    paginationContainer;
    currentPage = 1;
    totalPages = 1;
    constructor() {
        this.seriesContent = document.getElementById('series-content');
        this.loadingSpinner = document.querySelector('.loading-spinner');
        this.paginationContainer = document.getElementById('pagination');
        if (!this.seriesContent || !this.loadingSpinner || !this.paginationContainer) {
            throw new Error("Required DOM elements not found");
        }
        const urlParams = new URLSearchParams(window.location.search);
        this.currentPage = parseInt(urlParams.get('page') || '1');
        this.setupNavbar();
        this.loadSeries(this.currentPage);
    }
    async loadSeries(page) {
        this.showLoading(true);
        try {
            const response = await seriesService.getPopularSeries(page);
            // Check if response contains valid data
            if (!response || !response.results || !Array.isArray(response.results)) {
                throw new Error("Invalid API response structure");
            }
            this.renderSeries(response.results);
            this.totalPages = Math.min(response.total_pages, 500); // API limits to 500 pages
            this.renderPagination();
            // Update URL without reload
            window.history.pushState({}, '', `popularSeries.html?page=${page}`);
        }
        catch (error) {
            console.error('Error loading movies:', error);
        }
        finally {
            this.showLoading(false);
        }
    }
    renderSeries(seriesList) {
        if (!Array.isArray(seriesList)) {
            this.showError(new Error('Invalid series data format'));
            return;
        }
        this.seriesContent.innerHTML = '';
        if (seriesList.length === 0) {
            this.showNoResults();
            return;
        }
        const fragment = document.createDocumentFragment();
        seriesList.forEach(series => {
            if (!series || typeof series !== 'object')
                return;
            const card = document.createElement('div');
            card.className = 'col';
            const title = series.name || 'Untitled Series';
            const year = series.first_air_date ? new Date(series.first_air_date).getFullYear() : 'N/A';
            const posterPath = series.poster_path || '';
            const poster = posterPath
                ? `https://image.tmdb.org/t/p/w500${posterPath}`
                : 'placeholder.jpg';
            const overview = series.overview || 'No overview available';
            const voteAverage = series.vote_average ? series.vote_average.toFixed(1) : 'N/A';
            card.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${poster}" class="card-img-top" alt="${title}" loading="lazy"
                         onerror="this.onerror=null;this.src='placeholder.jpg'">
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
                if (series.id) {
                    window.location.href = `../Series/details.html?id=${series.id}`;
                }
            });
            fragment.appendChild(card);
        });
        this.seriesContent.appendChild(fragment);
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
                this.loadSeries(this.currentPage);
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
                this.loadSeries(this.currentPage);
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
                this.loadSeries(this.currentPage);
            }
        });
        this.paginationContainer.appendChild(nextLi);
    }
    showLoading(show) {
        this.loadingSpinner.style.display = show ? 'block' : 'none';
        this.seriesContent.style.opacity = show ? '0.5' : '1';
    }
    showError(error) {
        this.seriesContent.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger">
                    ${error.message || 'Failed to load series.'}
                    <button class="btn btn-sm btn-outline-danger ms-3" id="retry-btn">Retry</button>
                </div>
            </div>
        `;
        document.getElementById('retry-btn')?.addEventListener('click', () => {
            this.loadSeries(this.currentPage);
        });
    }
    showNoResults() {
        this.seriesContent.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-info">
                    No series found. Please try a different page.
                </div>
            </div>
        `;
    }
    setupNavbar() {
        const navLinks = document.querySelectorAll('.nav-link');
        if (navLinks.length > 0) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector('.nav-link[href="allseries.html"]');
            if (activeLink)
                activeLink.classList.add('active');
        }
    }
}
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new AllSeriesPage();
    }
    catch (error) {
        console.error("Failed to initialize AllSeriesPage:", error);
        const errorElement = document.createElement('div');
        errorElement.className = 'alert alert-danger m-3';
        errorElement.textContent = 'Failed to initialize series page. Please refresh.';
        document.body.prepend(errorElement);
    }
});
