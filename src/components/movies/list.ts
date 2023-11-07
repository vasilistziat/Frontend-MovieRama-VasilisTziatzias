import type { Movie, MovieGenres } from 'types/movie';
import { getMovieAssets } from './media';
import { stringToHtml } from 'utils/dom';
import { getMovie } from 'api/movie';
import { buildMovieInfobox, closeInfobox } from './infoBox';
import { getGenders } from 'api/genders';

let gendersList: MovieGenres[] = [];

export const buildMovies = async (moviesData: Movie[]) => {
    const moviesList: Element[] = [];
    if (!gendersList.length) gendersList = await getGendersList();

    moviesData.forEach((movie) => {
        const rating = (movie.vote_average / 10) * 100;
        const poster = getMovieAssets(movie).poster;
        const movieDate = new Date(movie.release_date);
        const htmlString = `
            <article class="movie-card" data-movie-id="${movie.id}">
                <div class="loader"><i class="fa-solid fa-circle-notch"></i></div>
                <div class="movie-card__details">
                    <div class="movie-rating">
                        <div class="movie-rating__stars">
                            <i class="fa-regular fa-star empty"></i>
                            <i class="fa-solid fa-star full" style="width: ${rating}%"></i>
                        </div>
                        <span class="movie-rating__number">${movie.vote_average.toFixed(
                            1
                        )}</span>
                    </div>
                    ${poster.image}
                    <div class="movie-info">
                        <h3>${movie.title} (${movieDate.getFullYear()})</h3>
                        <span class="date">${movie.release_date}</span>
                    </div>
                </div>
            </article>
        `;
        const movieHtml = stringToHtml(htmlString);
        moviesList.push(movieHtml);
    });

    return moviesList;
};

export const handleMovieClick = async (event: Event) => {
    const currentMovie = event.target as Element;
    const movieInfoboxElement = document.getElementById('movie-details');
    if (!currentMovie || !currentMovie.getAttribute('data-movie-id')) return;

    currentMovie.classList.add('loading');

    const movieDetailsResponse = await getMovie(
        currentMovie.getAttribute('data-movie-id')!
    );
    if (!movieDetailsResponse.ok) return false;

    const response = await movieDetailsResponse.json();
    const infoboxContent = await buildMovieInfobox(response);

    movieInfoboxElement?.append(infoboxContent as Element);
    movieInfoboxElement?.classList.add('is-active');
    document.querySelector('html')?.classList.add('is-infobox-active');
    currentMovie.classList.remove('loading');
    document.addEventListener('keydown', handleEscButton);
};

const handleEscButton = (event: KeyboardEvent) => {
    if (event.code == 'Escape') {
        closeInfobox();
        document.removeEventListener('keydown', handleEscButton);
    }
};

const getGendersList = async () => {
    const response = await getGenders();
    if (!response.ok) return false;
    const genderResponse = await response.json();

    return genderResponse.genres;
};
