import { SeriesDetails } from "./SeriesInterface";
import { seriesService } from "./seriesOperations.js";

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const seriesId = urlParams.get('id');
    console.log("Extracted series ID from URL:", seriesId);
    
    if (!seriesId) {
        window.location.href = '../index.html';
        return;
    }
    
    try {
        const series = await seriesService.getSeriesDetails(parseInt(seriesId));
        console.log("Fetched series data:", series);
        displaySeriesDetails(series);
        
    } catch (error) {
        console.error('Error loading series details:', error);
        const errorElement = document.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = 'Failed to load series details. Please try again later.';
            errorElement.style.display = 'block';
        }
    }
});

function displaySeriesDetails(series: SeriesDetails): void {
    // Helper function to safely display data
    const displayData = (elementId: string, value: any, formatter?: (val: any) => string) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value !== undefined && value !== null 
                ? (formatter ? formatter(value) : value.toString())
                : 'N/A';
        }
    };

    // Basic info
    displayData('series-title', series.name);
    displayData('series-tagline', series.tagline);
    displayData('series-overview', series.overview);
    displayData('series-rating', series.vote_average?.toFixed(1));
    displayData('series-status-text', series.status);
    displayData('series-type-text', series.type);
    displayData('series-original-name', series.original_name);
    displayData('series-original-language', series.original_language);

    // Dates
    displayData('series-first-air-date', series.first_air_date, (date) => new Date(date).toLocaleDateString());
    displayData('series-last-air-date', series.last_air_date, (date) => date ? new Date(date).toLocaleDateString() : 'N/A');

    // Counts
    displayData('series-episode-count', series.number_of_episodes);
    displayData('series-season-count', series.number_of_seasons);

    // Images
    const posterImg = document.getElementById('series-poster') as HTMLImageElement;
    posterImg.src = series.poster_path 
        ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
        : 'placeholder-image.jpg';
    posterImg.alt = `${series.name} poster`;

    const backdropImg = document.getElementById('series-backdrop') as HTMLImageElement;
    if (series.backdrop_path) {
        backdropImg.onload = () => {
            backdropImg.classList.add('loaded');
        };
        backdropImg.src = `https://image.tmdb.org/t/p/original${series.backdrop_path}`;
    } else {
        backdropImg.style.display = 'none';
    }

    // Genres
    const genresContainer = document.getElementById('series-genres')!;
    genresContainer.innerHTML = series.genres?.length
        ? series.genres.map(genre => `<span class="badge bg-secondary me-1">${genre.name}</span>`).join('')
        : 'N/A';

    // Networks
    const networksContainer = document.getElementById('series-networks')!;
    networksContainer.textContent = series.networks?.length
        ? series.networks.map(network => network.name).join(', ')
        : 'N/A';

    // Production
    displayData('series-production-countries', 
        series.production_countries?.map(c => c.name).join(', '));
    displayData('series-spoken-languages', 
        series.spoken_languages?.map(l => l.english_name).join(', '));

    // Homepage link
    const homepageElement = document.getElementById('series-homepage');
    if (homepageElement) {
        homepageElement.innerHTML = series.homepage
            ? `<a href="${series.homepage}" target="_blank" class="text-primary">${series.homepage}</a>`
            : 'N/A';
    }

    // Seasons
    const seasonsContainer = document.getElementById('series-seasons')!;
    if (series.seasons?.length) {
        seasonsContainer.innerHTML = series.seasons
            .filter(season => season.season_number > 0) // Skip season 0 (specials)
            .map(season => `
                <div class="col-md-3 mb-4">
                    <div class="card season-card h-100">
                        <img src="${season.poster_path 
                            ? `https://image.tmdb.org/t/p/w300${season.poster_path}`
                            : 'placeholder-image.jpg'}" 
                            class="card-img-top" alt="${season.name}">
                        <div class="card-body">
                            <h5 class="card-title">${season.name}</h5>
                            <p class="card-text">
                                <small class="text-muted">
                                    ${season.air_date ? new Date(season.air_date).getFullYear() : 'TBA'} • 
                                    ${season.episode_count} episodes
                                </small>
                            </p>
                            ${season.overview ? `<p class="card-text">${season.overview.slice(0, 100)}...</p>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
    } else {
        seasonsContainer.innerHTML = '<div class="text-muted">No season information available</div>';
    }

    // Production status badge
    const statusBadge = document.getElementById('series-status-badge');
    if (statusBadge) {
        statusBadge.className = `badge ${series.in_production ? 'bg-success' : 'bg-secondary'}`;
        statusBadge.textContent = series.in_production ? 'In Production' : 'Completed';
    }
}