//Rollup need this in order to watch scss
import './scss/bundle.scss';

import render from './components/nowPlaying';
import initInfiniteScroll from './components/infiniteScroll';
import { initSearch } from 'components/search';
import { handleMovieClick } from 'components/movies/buildList';

render();
initSearch();
initInfiniteScroll();

document.addEventListener('click', (event) => {
    document.querySelectorAll('[data-movie-id]').forEach((targetElement) => {
        if (targetElement === event.target) {
            handleMovieClick(event);
        }
    });
});
