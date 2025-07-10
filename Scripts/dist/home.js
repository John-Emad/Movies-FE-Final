import { MovieService } from './moviesOperations.js';
import { SeriesService } from './seriesOperations.js';
const movieService = new MovieService();
const seriesService = new SeriesService();
let currentMoviePage = 1;
let currentSeriesPage = 1;
document.addEventListener('DOMContentLoaded', async () => {
    await loadAndRenderMovies(currentMoviePage);
    await loadAndRenderSeries(currentSeriesPage);
    document.getElementById('next-page')?.addEventListener('click', async () => {
        currentMoviePage++;
        await loadAndRenderMovies(currentMoviePage);
    });
    document.getElementById('prev-page')?.addEventListener('click', async () => {
        if (currentMoviePage > 1) {
            currentMoviePage--;
            await loadAndRenderMovies(currentMoviePage);
        }
    });
    document.querySelector('.nav-link[href="#movies"]')?.addEventListener('click', async () => {
        currentMoviePage = 1;
        await loadAndRenderMovies(currentMoviePage);
    });
    document.querySelector('.nav-link[href="#tv"]')?.addEventListener('click', async () => {
        currentSeriesPage = 1;
        await loadAndRenderSeries(currentSeriesPage);
    });
});
async function loadAndRenderMovies(page) {
    try {
        const movies = await movieService.getTopRatedMovies(page);
        renderMovies(movies, 'movie-list');
    }
    catch (error) {
        console.error('Failed to load movies:', error);
    }
}
async function loadAndRenderSeries(page) {
    try {
        const series = await seriesService.getTopRatedSeries(page);
        renderSeries(series, 'series-list');
    }
    catch (error) {
        console.error('Failed to load series:', error);
    }
}
function renderMovies(movies, containerId) {
    const container = document.getElementById(containerId);
    if (!container)
        return;
    container.innerHTML = '';
    movies.forEach(movie => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">${movie.overview.slice(0, 100)}...</p>
          <p class="card-text"><small class="text-muted">Release: ${movie.release_date}</small></p>
          <p class="card-text"><small class="text-muted">Rating: ${movie.vote_average}</small></p>
        </div>
      </div>
    `;
        container.appendChild(col);
    });
}
function renderSeries(seriesList, containerId) {
    const container = document.getElementById(containerId);
    if (!container)
        return;
    container.innerHTML = '';
    seriesList.forEach(series => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="https://image.tmdb.org/t/p/w500${series.poster_path}" class="card-img-top" alt="${series.name}">
        <div class="card-body">
          <h5 class="card-title">${series.name}</h5>
          <p class="card-text">${series.overview.slice(0, 100)}...</p>
          <p class="card-text"><small class="text-muted">First Air Date: ${series.first_air_date}</small></p>
          <p class="card-text"><small class="text-muted">Rating: ${series.vote_average}</small></p>
        </div>
      </div>
    `;
        container.appendChild(col);
    });
}
//# sourceMappingURL=home.js.map