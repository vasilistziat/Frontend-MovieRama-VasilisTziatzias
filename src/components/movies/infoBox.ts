import { Movie, Review } from 'types/movie';
import { getImageSrc, getMovieAssets, getTrailer } from './media';
import { getDuration } from 'utils/time';
import { stringToHtml } from 'utils/dom';
import { getReviews } from 'api/reviews';
import { renderReviews } from './reviews';
import { renderSimilar } from './similar';
import { getSimilar } from 'api/similar';
import { renderTrailers } from './trailers';

const movieTabs = ['Trailer', 'Reviews', 'Recommended'];

export const buildMovieInfobox = async (movie: Movie) => {
    const movieBackdrop = getMovieAssets(movie).backdrop;
    const moviePoster = getMovieAssets(movie).poster;
    const movieDate = new Date(movie.release_date);

    const getReviewsresponse = await getReviews(movie.id);
    if (!getReviewsresponse.ok) return false;
    const reviewsResponse = await getReviewsresponse.json();

    const getSimilarResponse = await getSimilar(movie.id);
    if (!getSimilarResponse.ok) return false;
    const similarResponse = await getSimilarResponse.json();

    const trailers = await getTrailer(movie);

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
                <div class="tabs-body" data-movie-tab-body>
                    ${trailers ? renderTrailers(trailers) : ''}
                    ${renderReviews(reviewsResponse.results)}
                    ${renderSimilar(similarResponse.results)}
                </div>
            </div>
        </div>
    `;

    const infobox = stringToHtml(htmlString);
    renderClose(infobox);
    renderTabActions(infobox, reviewsResponse.results);
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

const renderTabActions = (element: Element, reviews: Review[]) => {
    const tabs: Element[] = [];
    movieTabs.forEach((tab, index) => {
        if (tab == 'Reviews' && reviews.length < 2) return;

        const htmlString = `
            <button type="button" ${
                index == 0 ? 'class="active"' : ''
            } data-tab-action="${index + 1}">${
                tab == 'Reviews' ? `${tab} (${reviews.length})` : tab
            }</button>
        `;
        const tabAction = stringToHtml(htmlString);
        tabAction.addEventListener('click', (event) => {
            element
                .querySelectorAll('[data-tab-action]')
                ?.forEach((element) => element.classList.remove('active'));
            (event.target as Element).classList.add('active');
            element
                .querySelectorAll('[data-tab-body-index]')
                .forEach((tabBody) => tabBody.classList.remove('active'));
            element
                .querySelector(`[data-tab-body-index="${index + 1}"]`)
                ?.classList.add('active');
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
        movieInfoboxElement.innerHTML = '';
    }
};
