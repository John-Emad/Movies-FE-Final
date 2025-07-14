import { movieService } from "./moviesOperations.js"; // Note: use instance, not class
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    console.log("Extracted movie ID from URL:", movieId);
    if (!movieId) {
        window.location.href = '../index.html';
        return;
    }
    try {
        // CORRECTED: Use getMovieDetails instead of navigateToMovieDetails
        const movie = await movieService.getMovieDetails(parseInt(movieId));
        console.log("Fetched movie data:", movie); // Debug line
        // ADDED: Call display function with the fetched movie
        displayMovieDetails(movie);
    }
    catch (error) {
        console.error('Error loading movie details:', error);
        const errorElement = document.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = 'Failed to load movie details. Please try again later.';
            errorElement.style.display = 'block';
        }
    }
});
function displayMovieDetails(movie) {
    // Helper function to safely display data
    const displayData = (elementId, value, formatter) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value !== undefined && value !== null
                ? (formatter ? formatter(value) : value.toString())
                : 'N/A';
        }
    };
    // Basic info
    displayData('movie-title', movie.title);
    displayData('movie-tagline', movie.tagline);
    displayData('movie-overview', movie.overview);
    displayData('movie-rating', movie.vote_average?.toFixed(1));
    displayData('movie-runtime', movie.runtime, (mins) => `${mins} mins`);
    displayData('movie-release-date', movie.release_date, (date) => new Date(date).toLocaleDateString());
    displayData('movie-status', movie.status);
    displayData('movie-popularity', movie.popularity?.toFixed(2));
    displayData('movie-vote-count', movie.vote_count?.toLocaleString());
    displayData('movie-imdb-id', movie.imdb_id);
    displayData('movie-original-title', movie.original_title);
    displayData('movie-original-language', movie.original_language);
    // Images
    const posterImg = document.getElementById('movie-poster');
    posterImg.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'placeholder-image.jpg';
    posterImg.alt = `${movie.title} poster`;
    const backdropImg = document.getElementById('movie-backdrop');
    if (movie.backdrop_path) {
        backdropImg.onload = () => {
            backdropImg.classList.add('loaded');
        };
        backdropImg.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    }
    else {
        // Fallback if no backdrop exists
        backdropImg.style.display = 'none';
    }
    // Genres
    const genresContainer = document.getElementById('movie-genres');
    genresContainer.innerHTML = movie.genres?.length
        ? movie.genres.map(genre => `<span class="badge bg-secondary me-1">${genre.name}</span>`).join('')
        : 'N/A';
    // Financials
    displayData('movie-budget', movie.budget, (budget) => budget ? `$${budget.toLocaleString()}` : 'N/A');
    displayData('movie-revenue', movie.revenue, (revenue) => revenue ? `$${revenue.toLocaleString()}` : 'N/A');
    // Production
    displayData('movie-production-countries', movie.production_countries?.map(c => c.name).join(', '));
    displayData('movie-spoken-languages', movie.spoken_languages?.map(l => l.english_name).join(', '));
    // Collection
    displayData('movie-collection', movie.belongs_to_collection?.name);
    // Production Companies
    const companiesContainer = document.getElementById('movie-companies');
    companiesContainer.innerHTML = movie.production_companies?.length
        ? movie.production_companies
            .filter(company => company.logo_path)
            .map(company => `
                <div class="company-logo">
                    <img src="https://image.tmdb.org/t/p/w200${company.logo_path}" 
                         alt="${company.name}" title="${company.name}">
                    <div class="company-name">${company.name}</div>
                </div>
            `).join('')
        : '<div class="text-muted">No company data available</div>';
    // Homepage link
    const homepageElement = document.getElementById('movie-homepage');
    if (homepageElement) {
        homepageElement.innerHTML = movie.homepage
            ? `<a href="${movie.homepage}" target="_blank" class="text-primary">${movie.homepage}</a>`
            : 'N/A';
    }
    // Adult content warning
    if (movie.adult) {
        const adultWarning = document.createElement('div');
        adultWarning.className = 'alert alert-warning mt-3';
        adultWarning.textContent = 'This movie contains adult content';
        document.querySelector('.movie-info')?.appendChild(adultWarning);
    }
}
