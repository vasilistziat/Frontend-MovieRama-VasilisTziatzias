import { Movie } from 'types/movie';
import { getImageSrc, getPoster, getTrailer } from './media';
import { getDuration } from 'utils/time';
import { stringToHtml } from 'utils/dom';

const movieTabs = ['Trailer', 'Reviews', 'Recommended'];

export const buildMovieInfobox = async (movie: Movie) => {
    const movieBackdrop = getPoster(movie).backdrop;
    const moviePoster = getPoster(movie).poster;
    const movieDate = new Date(movie.release_date);
    const htmlString = `
        <div class="movie-infobox">
            <div class="container container--sm">
                <div class="movie-infobox__header" style="background-image: url(${getImageSrc(
                    movieBackdrop.src
                )});" data-movie-infobox-header>
                    <div class="movie-poster">
                        ${moviePoster.image}
                    </div>
                    <div class="movie-header-info">
                        <h2>${
                            movie.title
                        } <span class="year">(${movieDate.getFullYear()})</span></h2>
                        <div class="movie-meta">
                            <span>${movieDate.toDateString()}</span>
                            <span> • </span>
                            <span>${movie.genres
                                ?.map((x) => x.name)
                                .join(', ')}</span>
                            <span> • </span>
                            <span>${getDuration(movie.runtime)}</span>
                        </p>
                        <p>${movie.overview}</p>
                    </div>
                </div>
            </div>
            <div class="movie-infobox__content">
                <div class="tabs-header" data-movie-tab-actions></div>
                <div class="tabs-body">
                    <div class="tab-content tab-content--trailers" data-tab-index="1">
                        ${await getTrailer(movie)}
                    </div>
                </div>
            </div>
        </div>
    `;

    const infobox = stringToHtml(htmlString);
    renderClose(infobox);
    renderTabActions(infobox);

    return infobox;
};

const renderClose = (element: Element) => {
    const closeInfoboxHtml = `
        <button type="button" class="close-button"><i class="fa-solid fa-xmark"></i></button>
    `;
    const closeInfoboxElement = stringToHtml(closeInfoboxHtml);
    closeInfoboxElement.addEventListener('click', () => {
        closeInfobox();
    });
    element
        ?.querySelector('[data-movie-infobox-header]')
        ?.append(closeInfoboxElement);
};

const renderTabActions = (element: Element) => {
    const tabs: Element[] = [];
    movieTabs.forEach((tab, index) => {
        const htmlString = `
            <button type="button" ${
                index == 0 ? 'class="active"' : ''
            } data-tab-action>${tab}</button>
        `;
        const tabAction = stringToHtml(htmlString);
        tabAction.addEventListener('click', (event) => {
            element
                .querySelectorAll('[data-tab-action]')
                ?.forEach((element) => element.classList.remove('active'));
            (event.target as Element).classList.add('active');
        });
        tabs.push(tabAction);
    });

    element.querySelector('[data-movie-tab-actions]')?.append(...tabs);
};

export const closeInfobox = () => {
    const movieInfoboxElement = document.getElementById('movie-details');
    if (movieInfoboxElement) {
        movieInfoboxElement.classList.remove('is-active');
        document.querySelector('html')?.classList.remove('is-infobox-active');
        setTimeout(() => {
            movieInfoboxElement.innerHTML = '';
        }, 400);
    }
};
