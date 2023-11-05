import nowPlaying from '../requests/nowPlaying';
import { removeSkeletonCards, renderSkeletonCards } from './skeleton';
import { Movie } from '../types/movie';
import { Movies } from '../models/movies';

const moviesModel = new Movies();

export default async function render(pagenumber?: number) {
    const nowPlayingWrapper = document.querySelector('[data-movies-list]')!;
    renderSkeletonCards(nowPlayingWrapper, 20);

    try {
        const nowPlayingResponse = await nowPlaying(pagenumber);

        if (!nowPlayingResponse.ok) return false;

        const response = await nowPlayingResponse.json();

        removeSkeletonCards(nowPlayingWrapper);
        const data = response.results as Movie[];
        moviesModel.buildMovies(data);
        nowPlayingWrapper.append(...moviesModel.getMovieList());
    } catch (error) {
        console.error(error);
    }
}
