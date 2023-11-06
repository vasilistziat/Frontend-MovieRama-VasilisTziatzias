import render from './nowPlaying';
import { renderSearch } from './search';

export default function initInfiniteScroll() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.75
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const moviesListElement =
                    document.querySelector('[data-movies-list]');

                if (!moviesListElement) return;

                const moviesPage = moviesListElement.getAttribute(
                    'data-movies-page'
                )
                    ? moviesListElement.getAttribute('data-movies-page')!
                    : '1';

                const pageResults = moviesListElement.getAttribute(
                    'data-movies-results'
                )
                    ? moviesListElement.getAttribute('data-movies-results')!
                    : 'nowPlaying';

                const noFound =
                    moviesListElement?.getAttribute('data-no-found');

                const newMoviePage = parseInt(moviesPage) + 1;
                moviesListElement?.setAttribute(
                    'data-movies-page',
                    newMoviePage.toString()
                );

                if (!!noFound) return;

                if (pageResults === 'nowPlaying') {
                    render(newMoviePage);
                } else {
                    renderSearch(undefined, newMoviePage);
                }
            }
        });
    }, options);

    observer.observe(document.getElementById('footer')!);
}
