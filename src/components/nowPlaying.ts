import nowPlaying from '../api/nowPlaying';
import { removeSkeletonCards, renderSkeletonCards } from './skeleton';
import { Movie } from '../types/movie';
import { buildMovies } from './movies/list';

export default async function renderMovies(pagenumber?: number) {
    const nowPlayingWrapper = document.querySelector('[data-movies-list]')!;
    renderSkeletonCards(nowPlayingWrapper, 20);

    try {
        const nowPlayingResponse = await nowPlaying(pagenumber);

        if (!nowPlayingResponse.ok) return false;

        const response = await nowPlayingResponse.json();

        const data = response.results as Movie[];
        const buildMoviesList = await buildMovies(data);
        nowPlayingWrapper.append(...buildMoviesList);
        removeSkeletonCards(nowPlayingWrapper);
    } catch (error) {
        console.error(error);
    }
}
