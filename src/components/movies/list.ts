import type { Movie, MovieGenres } from 'types/movie';
import { getMovieAssets } from './media';
import { stringToHtml } from 'utils/dom';
import { getMovie } from 'api/movie';
import { buildMovieInfobox, closeInfobox } from './infoBox';
import { getGenres } from 'api/genres';

let genresList: MovieGenres[] = [];

export const buildMovies = async (moviesData: Movie[]) => {
    const moviesList: Element[] = [];
    if (!genresList.length) genresList = await getGenresList();

    moviesData.forEach((movie) => {
        const rating = (movie.vote_average / 10) * 100;
        const poster = getMovieAssets(movie).poster;
        const movieDate = new Date(movie.release_date);
        const movieGenres = genresList
            .filter((genre) => movie.genre_ids.includes(genre.id))
            .map((x) => x.name)
            .join(' • ');

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
                        <h3>${movie.title} ${
                            movie.release_date != ''
                                ? `<span>(${movieDate.getFullYear()})<span>`
                                : ''
                        }</h3>
                        <span class="genres">${movieGenres}</span>
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

    //Close previus infobox
    closeInfobox();

    if (!infoboxContent) return;

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

const getGenresList = async () => {
    const response = await getGenres();
    if (!response.ok) return false;
    const genreResponse = await response.json();

    return genreResponse.genres;
};
