import nowPlaying from "../requests/nowPlaying";
import { removeSkeletonCards, renderSkeletonCards } from "./skeleton";
import { Movie } from "../interfaces/movie";
import { Movies } from "../models/movies";

export default async function renderNowPlaying() {
    const nowPlayingWrapper = document.querySelector('[data-now-playing]')!;

    renderSkeletonCards(nowPlayingWrapper);

    try {
        const nowPlayingResponse = await nowPlaying();

        if( !nowPlayingResponse.ok ) return false;
        
        const response =  await nowPlayingResponse.json();

        removeSkeletonCards(nowPlayingWrapper);
        const data = response.results as Movie[];
        const movies = new Movies(data);
        nowPlayingWrapper.append(...movies.moviesList);

    } catch (error) {
        console.error(error);
    }
}