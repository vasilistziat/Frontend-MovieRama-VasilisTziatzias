import nowPlaying from '../api/nowPlaying';
import { removeSkeletonCards, renderSkeletonCards } from './skeleton';
import { Movie } from '../types/movie';
import { buildMovies } from './movies/list';

export default async function renderMovies(pagenumber?: number) {
    const nowPlayingWrapper = document.querySelector('[data-movies-list]')!;
    renderSkeletonCards(nowPlayingWrapper, 20);

    try {
        const response = await nowPlaying(pagenumber);
        if (!response.ok) return false;
        const nowPlayingResponse = await response.json();

        const data = nowPlayingResponse.results as Movie[];
        const buildMoviesList = await buildMovies(data);
        nowPlayingWrapper.append(...buildMoviesList);
        removeSkeletonCards(nowPlayingWrapper);
    } catch (error) {
        console.error(error);
    }
}
