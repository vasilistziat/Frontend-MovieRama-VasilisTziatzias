import { getSearch } from 'requests/search';
import renderMovies from './nowPlaying';
import { removeSkeletonCards, renderSkeletonCards } from './skeleton';
import { Movie } from 'types/movie';
import { buildMovies } from './movies/buildList';

let abortController = new AbortController();
const moviesListElement = document.querySelector('[data-movies-list]');
const movieList = document.querySelector('[data-movies-list]');
const searchInput = document.querySelector('[data-movie-search]');

export const initSearch = () => {
    searchInput?.addEventListener('input', searchListener);
};

export const renderSearch = async (
    results?: Movie[],
    pageNumber: number = 1
) => {
    if (!movieList || !searchInput) return;
    renderSkeletonCards(movieList, 10);
    moviesListElement?.removeAttribute('data-no-found');

    try {
        let data: Movie[] = [];

        if (!results) {
            const searchResponse = await getResults(
                (searchInput as HTMLInputElement).value,
                pageNumber
            );
            if (searchResponse.page <= searchResponse.total_pages) {
                data = searchResponse.results as Movie[];
            } else {
                moviesListElement?.setAttribute('data-no-found', 'true');
            }
        } else {
            data = results;
        }

        const buildMoviesList = await buildMovies(data);
        removeSkeletonCards(movieList);
        movieList.append(...buildMoviesList);
    } catch (error) {
        console.error(error);
    }
};

const searchListener = async (event: Event) => {
    const terms = (event?.target as HTMLInputElement).value;

    if (terms != '') {
        abortController.abort();
        abortController = new AbortController();
        moviesListElement?.setAttribute('data-movies-results', 'search');
        const response = await getResults(terms, 1, abortController.signal);
        if (response) {
            if (movieList) movieList.innerHTML = '';
            moviesListElement?.setAttribute('data-movies-page', '1');
            if (response.page <= response.total_pages) {
                renderSearch(response.results);
            }
        }
    } else {
        if (moviesListElement) moviesListElement.innerHTML = '';
        moviesListElement?.setAttribute('data-movies-results', 'nowPlaying');
        moviesListElement?.removeAttribute('data-no-found');
        renderMovies();
    }
};

const getResults = async (
    terms: string,
    pageNumber: number,
    signal?: AbortSignal
) => {
    try {
        const response = await getSearch(terms, pageNumber, signal);

        if (!response.ok) return false;
        const searchResponse = await response.json();

        return searchResponse;
    } catch (error) {
        if ((error as Error).name !== 'AbortError') {
            console.error(error);
        }
    }
};
