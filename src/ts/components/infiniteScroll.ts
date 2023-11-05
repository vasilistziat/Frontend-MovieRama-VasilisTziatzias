import render from './nowPlaying';

export default function initInfiniteScroll() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.9
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            // const hasData = !document.getElementById('noResultsFound');
            if (entry.isIntersecting) {
                // if (searchInput.value) {
                //     searchForMovies(searchInput.value);
                // } else {
                //     getNowPlayingMovies();
                // }
                const moviesListElement =
                    document.querySelector('[data-movies-list]');
                const moviesPage =
                    moviesListElement &&
                    moviesListElement.getAttribute('data-movies-page')
                        ? moviesListElement.getAttribute('data-movies-page')!
                        : '1';
                const newMoviePage = parseInt(moviesPage) + 1;
                moviesListElement?.setAttribute(
                    'data-movies-page',
                    newMoviePage.toString()
                );
                render(newMoviePage);
            }
        });
    }, options);

    observer.observe(document.getElementById('footer')!);
}
