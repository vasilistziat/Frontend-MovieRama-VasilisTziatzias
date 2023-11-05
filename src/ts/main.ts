//Rollup need this in order to watch scss
import '../scss/bundle.scss';

import render from './components/nowPlaying';
import initInfiniteScroll from './components/infiniteScroll';

initInfiniteScroll();
render();
