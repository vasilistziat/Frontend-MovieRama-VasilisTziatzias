(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    const defaultUrl = 'https://api.themoviedb.org/3';
    const apiKey = 'bc50218d91157b1ba4f142ef7baaa6a0';
    const paths = {
        nowPlaying: '/movie/now_playing',
        movie: '/movie',
        search: '/search/movie',
        genres: '/genre/movie/list'
    };
    var Endpoints;
    (function (Endpoints) {
        Endpoints[Endpoints["NowPlaying"] = 0] = "NowPlaying";
        Endpoints[Endpoints["MovieList"] = 1] = "MovieList";
    })(Endpoints || (Endpoints = {}));

    function nowPlaying(pageNumber = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${defaultUrl}${paths.nowPlaying}?api_key=${apiKey}&page=${pageNumber}&language=en-US`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        });
    }

    const renderSkeletonCards = (wrapper, numberOfCards = 10) => {
        let cards = '';
        for (let i = 0; i < numberOfCards; i++) {
            cards += `<div class="skeleton-card"></div>`;
        }
        wrapper.innerHTML += cards;
    };
    const removeSkeletonCards = (wrapper) => {
        wrapper
            .querySelectorAll('.skeleton-card')
            .forEach((skeleton) => skeleton.remove());
    };

    const imageDefaultUrl = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2';
    const imageBackdropDefaultUrl = 'https://image.tmdb.org/t/p/w1920_and_h800_multi_faces';
    const avatarDefaultUrl = 'https://image.tmdb.org/t/p/w150_and_h150_face/';

    function getMovie(movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${defaultUrl}${paths.movie}/${movieId}?api_key=${apiKey}&language=en-US`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        });
    }
    function getVideos(movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${defaultUrl}${paths.movie}/${movieId}/videos?api_key=${apiKey}&language=en-US`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        });
    }

    const getTrailer = (movie) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield getVideos(movie.id);
        if (!response.ok)
            return false;
        const videosResponse = (yield response.json());
        const trailers = videosResponse.results.filter((video) => video.type == 'Trailer');
        if (!!videosResponse.results.length && !!trailers.length) {
            const trailersString = [];
            trailers.forEach((trailer) => {
                trailersString.push(`
                <div class="responsive-iframe-video">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailer.key}" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
            `);
            });
            return trailersString.join('');
        }
        else {
            return 'No trailer found';
        }
    });
    const getMovieAssets = (movie) => {
        return {
            poster: {
                image: `<img src="${getImageSrc(movie.poster_path)}" alt="${movie.title}" />`,
                src: getImageSrc(movie.poster_path)
            },
            backdrop: {
                image: `<img src="${getImageSrc(movie.backdrop_path, true)}" alt="${movie.title}" />`,
                src: getImageSrc(movie.backdrop_path, true)
            }
        };
    };
    const getImageSrc = (imagePath, backdrop = false) => {
        let src = 'dist/assets/images/no-file-found.jpg';
        if (imagePath)
            src = `${backdrop ? imageBackdropDefaultUrl : imageDefaultUrl}/${imagePath}`;
        return src;
    };

    const stringToHtml = function (htmlString) {
        const parser = new DOMParser();
        return parser.parseFromString(htmlString, 'text/html').body
            .firstChild;
    };

    const getDuration = (time) => {
        const hours = time / 60;
        const roundedHours = Math.floor(hours);
        const minutes = (hours - roundedHours) * 60;
        const roundedMinutes = Math.round(minutes);
        return `${roundedHours}h ${roundedMinutes}m`;
    };

    function getReviews(movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${defaultUrl}${paths.movie}/${movieId}/reviews?api_key=${apiKey}&language=en-US`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        });
    }

    const renderReviews = (reviewsResponse) => {
        if (!reviewsResponse.length)
            return '';
        const reviewsList = [];
        reviewsResponse.forEach((review) => {
            const reviewDate = new Date(review.created_at);
            const html = `
        <div class="review">
            <div class="review__header">
                <div class="review__avatar">
                    <img src="${getAvatar(review.author_details.avatar_path)}" alt="${review.author}" />
                </div>
                <div class="review__meta">
                    <h4>${review.author}</h4>
                    <span class="published-date">Published at: ${reviewDate.toLocaleString()}</span>
                </div>
            </div>
            <div class="review__content">
                <p>${review.content}</p>
            </div>
        </div>
        `;
            reviewsList.push(html);
        });
        const reviewsTabHtml = `<div class="tab-content tab-content--reviews" data-tab-body-index="2">${reviewsList.join('')}</div>`;
        return reviewsTabHtml;
    };
    const getAvatar = (avatar) => {
        let authorAvatar = 'dist/assets/images/avatar_placeholder.jpg';
        if (avatar)
            authorAvatar = `${avatarDefaultUrl}${avatar}`;
        return authorAvatar;
    };

    const renderSimilar = (similarResponse) => {
        if (!similarResponse.length)
            return '';
        const similarList = [];
        similarResponse.forEach((movie) => {
            const backdrop = getMovieAssets(movie).backdrop;
            const rating = (movie.vote_average / 10) * 100;
            const movieDate = new Date(movie.release_date);
            const html = `
        <article class="movie-card movie-card--similar" data-movie-id="${movie.id}" style="background-image: url(${backdrop.src})">
            <div class="loader"><i class="fa-solid fa-circle-notch"></i></div>
            <div class="movie-card__details">
                <div class="movie-rating">
                    <div class="movie-rating__stars">
                        <i class="fa-regular fa-star empty"></i>
                        <i class="fa-solid fa-star full" style="width: ${rating}%"></i>
                    </div>
                    <span class="movie-rating__number">${movie.vote_average.toFixed(1)}</span>
                </div>
                <div class="movie-info">
                    <h3>${movie.title} (${movieDate.getFullYear()})</h3>
                    <span class="date">${movie.release_date}</span>
                </div>
            </div>
        </article>
        `;
            similarList.push(html);
        });
        const similarTabHtml = `
    <div class="tab-content" data-tab-body-index="3">
        <div class="similar-list">${similarList.join('')}</div>
    </div>
    `;
        return similarTabHtml;
    };

    function getSimilar(movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${defaultUrl}${paths.movie}/${movieId}/similar?api_key=${apiKey}&language=en-US&page=1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        });
    }

    const renderTrailers = (tarilersHtml) => {
        const trailerTabHtml = `
        <div class="tab-content active" data-tab-body-index="1">
            <div class="trailers">
                ${tarilersHtml}
            </div>
        </div>
    `;
        return trailerTabHtml;
    };

    const movieTabs = ['Trailer', 'Reviews', 'Recommended'];
    const buildMovieInfobox = (movie) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const movieBackdrop = getMovieAssets(movie).backdrop;
        const moviePoster = getMovieAssets(movie).poster;
        const movieDate = new Date(movie.release_date);
        const trailers = yield getTrailer(movie);
        const rating = (movie.vote_average / 10) * 100;
        const getReviewsresponse = yield getReviews(movie.id);
        if (!getReviewsresponse.ok)
            return false;
        const reviewsResponse = yield getReviewsresponse.json();
        const getSimilarResponse = yield getSimilar(movie.id);
        if (!getSimilarResponse.ok)
            return false;
        const similarResponse = yield getSimilarResponse.json();
        const htmlString = `
        <div class="movie-infobox">
            <div class="container container--sm">
                <div class="movie-infobox__header" style="background-image: url(${getImageSrc(movieBackdrop.src)});" data-movie-infobox-header>
                    <div class="movie-poster">
                        ${moviePoster.image}
                    </div>
                    <div class="movie-header-info">
                        <h2>${movie.title} <span class="year">(${movieDate.getFullYear()})</span></h2>
                        <div class="movie-rating">
                            <div class="movie-rating__stars">
                                <i class="fa-regular fa-star empty"></i>
                                <i class="fa-solid fa-star full" style="width: ${rating}%"></i>
                            </div>
                            <span class="movie-rating__average">${movie.vote_average.toFixed(1)}</span>
                            <span class="movie-rating__number">(${movie.vote_count})</span>
                        </div>
                        <div class="movie-meta">
                            <span>${movieDate.toDateString()}</span>
                            <span> • </span>
                            <span>${(_a = movie.genres) === null || _a === void 0 ? void 0 : _a.map((x) => x.name).join(', ')}</span>
                            <span> • </span>
                            <span>${getDuration(movie.runtime)}</span>
                        </div>
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
    });
    const renderClose = (element) => {
        var _a;
        const closeInfoboxHtml = `
        <button type="button" class="close-button"><i class="fa-solid fa-xmark"></i></button>
    `;
        const closeInfoboxElement = stringToHtml(closeInfoboxHtml);
        closeInfoboxElement.addEventListener('click', () => {
            closeInfobox();
        });
        (_a = element === null || element === void 0 ? void 0 : element.querySelector('[data-movie-infobox-header]')) === null || _a === void 0 ? void 0 : _a.append(closeInfoboxElement);
    };
    const renderTabActions = (element, reviews) => {
        var _a;
        const tabs = [];
        movieTabs.forEach((tab, index) => {
            if (tab == 'Reviews' && reviews.length < 2)
                return;
            const htmlString = `
            <button type="button" ${index == 0 ? 'class="active"' : ''} data-tab-action="${index + 1}">${tab == 'Reviews' ? `${tab} (${reviews.length})` : tab}</button>
        `;
            const tabAction = stringToHtml(htmlString);
            tabAction.addEventListener('click', (event) => {
                var _a, _b;
                (_a = element
                    .querySelectorAll('[data-tab-action]')) === null || _a === void 0 ? void 0 : _a.forEach((element) => element.classList.remove('active'));
                event.target.classList.add('active');
                element
                    .querySelectorAll('[data-tab-body-index]')
                    .forEach((tabBody) => tabBody.classList.remove('active'));
                (_b = element
                    .querySelector(`[data-tab-body-index="${index + 1}"]`)) === null || _b === void 0 ? void 0 : _b.classList.add('active');
            });
            tabs.push(tabAction);
        });
        (_a = element.querySelector('[data-movie-tab-actions]')) === null || _a === void 0 ? void 0 : _a.append(...tabs);
    };
    const closeInfobox = () => {
        var _a;
        const movieInfoboxElement = document.getElementById('movie-details');
        if (movieInfoboxElement) {
            movieInfoboxElement.classList.remove('is-active');
            (_a = document.querySelector('html')) === null || _a === void 0 ? void 0 : _a.classList.remove('is-infobox-active');
            movieInfoboxElement.innerHTML = '';
        }
    };

    function getGenres() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${defaultUrl}${paths.genres}?api_key=${apiKey}&language=en-US`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        });
    }

    let genresList = [];
    const buildMovies = (moviesData) => __awaiter(void 0, void 0, void 0, function* () {
        const moviesList = [];
        if (!genresList.length)
            genresList = yield getGenresList();
        moviesData.forEach((movie) => {
            const rating = (movie.vote_average / 10) * 100;
            const poster = getMovieAssets(movie).poster;
            const movieDate = new Date(movie.release_date);
            const movieGenres = genresList
                .filter((genre) => movie.genre_ids.includes(genre.id))
                .map((x) => x.name)
                .join(' • ');
            const htmlString = `
            <article class="movie-card" data-movie-id="${movie.id}">
                <div class="loader"><i class="fa-solid fa-circle-notch"></i></div>
                <div class="movie-card__details">
                    <div class="movie-rating">
                        <div class="movie-rating__stars">
                            <i class="fa-regular fa-star empty"></i>
                            <i class="fa-solid fa-star full" style="width: ${rating}%"></i>
                        </div>
                        <span class="movie-rating__number">${movie.vote_average.toFixed(1)}</span>
                    </div>
                    ${poster.image}
                    <div class="movie-info">
                        <h3>${movie.title} ${movie.release_date != ''
            ? `<span>(${movieDate.getFullYear()})<span>`
            : ''}</h3>
                        <span class="genres">${movieGenres}</span>
                        <span class="date">${movie.release_date}</span>
                    </div>
                </div>
            </article>
        `;
            const movieHtml = stringToHtml(htmlString);
            moviesList.push(movieHtml);
        });
        return moviesList;
    });
    const handleMovieClick = (event) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const currentMovie = event.target;
        const movieInfoboxElement = document.getElementById('movie-details');
        if (!currentMovie || !currentMovie.getAttribute('data-movie-id'))
            return;
        currentMovie.classList.add('loading');
        const movieDetailsResponse = yield getMovie(currentMovie.getAttribute('data-movie-id'));
        if (!movieDetailsResponse.ok)
            return false;
        const response = yield movieDetailsResponse.json();
        const infoboxContent = yield buildMovieInfobox(response);
        //Close previus infobox
        closeInfobox();
        if (!infoboxContent)
            return;
        movieInfoboxElement === null || movieInfoboxElement === void 0 ? void 0 : movieInfoboxElement.append(infoboxContent);
        movieInfoboxElement === null || movieInfoboxElement === void 0 ? void 0 : movieInfoboxElement.classList.add('is-active');
        (_a = document.querySelector('html')) === null || _a === void 0 ? void 0 : _a.classList.add('is-infobox-active');
        currentMovie.classList.remove('loading');
        document.addEventListener('keydown', handleEscButton);
    });
    const handleEscButton = (event) => {
        if (event.code == 'Escape') {
            closeInfobox();
            document.removeEventListener('keydown', handleEscButton);
        }
    };
    const getGenresList = () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield getGenres();
        if (!response.ok)
            return false;
        const genreResponse = yield response.json();
        return genreResponse.genres;
    });

    function renderMovies(pagenumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const nowPlayingWrapper = document.querySelector('[data-movies-list]');
            renderSkeletonCards(nowPlayingWrapper, 20);
            try {
                const response = yield nowPlaying(pagenumber);
                if (!response.ok)
                    return false;
                const nowPlayingResponse = yield response.json();
                const data = nowPlayingResponse.results;
                const buildMoviesList = yield buildMovies(data);
                nowPlayingWrapper.append(...buildMoviesList);
                removeSkeletonCards(nowPlayingWrapper);
            }
            catch (error) {
                console.error(error);
            }
        });
    }

    function getSearch(query, pageNumber = 1, signal) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${defaultUrl}${paths.search}?query=${query}&page=${pageNumber}&api_key=${apiKey}&language=en-US`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal
            });
            return response;
        });
    }

    let abortController = new AbortController();
    const moviesListElement = document.querySelector('[data-movies-list]');
    const movieList = document.querySelector('[data-movies-list]');
    const searchInput = document.querySelector('[data-movie-search]');
    const initSearch = () => {
        searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener('input', searchListener);
    };
    const renderSearch = (results, pageNumber = 1) => __awaiter(void 0, void 0, void 0, function* () {
        if (!movieList || !searchInput)
            return;
        renderSkeletonCards(movieList, 10);
        moviesListElement === null || moviesListElement === void 0 ? void 0 : moviesListElement.removeAttribute('data-no-found');
        try {
            let data = [];
            if (!results) {
                const searchResponse = yield getResults(searchInput.value, pageNumber);
                if (searchResponse.page <= searchResponse.total_pages) {
                    data = searchResponse.results;
                }
                else {
                    moviesListElement === null || moviesListElement === void 0 ? void 0 : moviesListElement.setAttribute('data-no-found', 'true');
                }
            }
            else {
                data = results;
            }
            const buildMoviesList = yield buildMovies(data);
            movieList.append(...buildMoviesList);
            removeSkeletonCards(movieList);
        }
        catch (error) {
            console.error(error);
        }
    });
    const searchListener = (event) => __awaiter(void 0, void 0, void 0, function* () {
        const terms = (event === null || event === void 0 ? void 0 : event.target).value;
        if (terms != '') {
            abortController.abort();
            abortController = new AbortController();
            moviesListElement === null || moviesListElement === void 0 ? void 0 : moviesListElement.setAttribute('data-movies-results', 'search');
            const response = yield getResults(terms, 1, abortController.signal);
            if (response) {
                if (movieList)
                    movieList.innerHTML = '';
                moviesListElement === null || moviesListElement === void 0 ? void 0 : moviesListElement.setAttribute('data-movies-page', '1');
                if (response.page <= response.total_pages) {
                    renderSearch(response.results);
                }
            }
        }
        else {
            if (moviesListElement)
                moviesListElement.innerHTML = '';
            moviesListElement === null || moviesListElement === void 0 ? void 0 : moviesListElement.setAttribute('data-movies-results', 'nowPlaying');
            moviesListElement === null || moviesListElement === void 0 ? void 0 : moviesListElement.removeAttribute('data-no-found');
            renderMovies();
        }
    });
    const getResults = (terms, pageNumber, signal) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield getSearch(terms, pageNumber, signal);
            if (!response.ok)
                return false;
            const searchResponse = yield response.json();
            return searchResponse;
        }
        catch (error) {
            if (error.name !== 'AbortError') {
                console.error(error);
            }
        }
    });

    function initInfiniteScroll() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.75
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const moviesListElement = document.querySelector('[data-movies-list]');
                    if (!moviesListElement)
                        return;
                    const noFound = moviesListElement === null || moviesListElement === void 0 ? void 0 : moviesListElement.getAttribute('data-no-found');
                    if (!!noFound)
                        return;
                    const moviesPage = moviesListElement.getAttribute('data-movies-page')
                        ? moviesListElement.getAttribute('data-movies-page')
                        : '1';
                    const pageResults = moviesListElement.getAttribute('data-movies-results')
                        ? moviesListElement.getAttribute('data-movies-results')
                        : 'nowPlaying';
                    const newMoviePage = parseInt(moviesPage) + 1;
                    moviesListElement === null || moviesListElement === void 0 ? void 0 : moviesListElement.setAttribute('data-movies-page', newMoviePage.toString());
                    if (pageResults === 'nowPlaying') {
                        renderMovies(newMoviePage);
                    }
                    else {
                        renderSearch(undefined, newMoviePage);
                    }
                }
            });
        }, options);
        observer.observe(document.getElementById('footer'));
    }

    //Rollup need this in order to watch scss
    renderMovies().then(() => {
        initSearch();
        initInfiniteScroll();
        document.addEventListener('click', (event) => {
            document
                .querySelectorAll('[data-movie-id]')
                .forEach((targetElement) => {
                if (targetElement === event.target) {
                    handleMovieClick(event);
                }
            });
        });
    });

}));
