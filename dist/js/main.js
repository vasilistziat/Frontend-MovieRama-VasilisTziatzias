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
        NowPlaying: '/movie/now_playing',
        MovieList: '/genre/movie/list',
        Movie: '/movie'
    };
    var Endpoints;
    (function (Endpoints) {
        Endpoints[Endpoints["NowPlaying"] = 0] = "NowPlaying";
        Endpoints[Endpoints["MovieList"] = 1] = "MovieList";
    })(Endpoints || (Endpoints = {}));

    function nowPlaying(pageNumber = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${defaultUrl}${paths.NowPlaying}?api_key=${apiKey}&page=${pageNumber}&language=en`, {
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
            cards += `
        <div class="skeleton-card">
            d
        </div>`;
        }
        wrapper.innerHTML += cards;
    };
    const removeSkeletonCards = (wrapper) => {
        wrapper
            .querySelectorAll('.skeleton-card')
            .forEach((skeleton) => skeleton.remove());
    };

    const stringToHtml = function (htmlString) {
        const parser = new DOMParser();
        return parser.parseFromString(htmlString, 'text/html').body
            .firstChild;
    };

    const imageDefaultUrl = 'http://image.tmdb.org/t/p/w300_and_h450_bestv2';
    const imageBackdropDefaultUrl = 'http://image.tmdb.org/t/p/w1920_and_h800_multi_faces';

    function getMovie(movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${defaultUrl}${paths.Movie}/${movieId}?api_key=${apiKey}&language=en`, {
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
            const response = yield fetch(`${defaultUrl}${paths.Movie}/${movieId}/videos?api_key=${apiKey}&language=en`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        });
    }

    const getDuration = (time) => {
        const hours = time / 60;
        const roundedHours = Math.floor(hours);
        const minutes = (hours - roundedHours) * 60;
        const roundedMinutes = Math.round(minutes);
        return `${roundedHours}h ${roundedMinutes}m`;
    };

    class Movies {
        constructor() {
            this.buildMovies = (moviesData) => {
                moviesData.forEach((movie) => {
                    const rating = (movie.vote_average / 10) * 100;
                    const poster = this.buildPoster(movie).poster;
                    const movieDate = new Date(movie.release_date);
                    const htmlString = `
                <article class="movie-card" data-movie-id="${movie.id}">
                    <div class="loader"><i class="fa-solid fa-circle-notch"></i></div>
                    <div class="movie-card__details">
                        <div class="movie-rating">
                            <div class="movie-rating__stars">
                                <i class="fa-regular fa-star empty"></i>
                                <i class="fa-solid fa-star full" style="width: ${rating}%"></i>
                            </div>
                        </div>
                        ${poster.image}
                        <div class="movie-info">
                            <h3>${movie.title} (${movieDate.getFullYear()})</h3>
                            <span class="date">${movie.release_date}</span>
                        </div>
                    </div>
                </article>
            `;
                    const movieHtml = stringToHtml(htmlString);
                    this.moviesList.push(movieHtml);
                });
            };
            this.getMovieList = () => {
                const list = this.moviesList;
                this.moviesList = [];
                return list;
            };
            this.handleMovieClick = (event) => __awaiter(this, void 0, void 0, function* () {
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
                const infoboxContent = yield this.buildMovieInfobox(response);
                movieInfoboxElement === null || movieInfoboxElement === void 0 ? void 0 : movieInfoboxElement.append(infoboxContent);
                movieInfoboxElement === null || movieInfoboxElement === void 0 ? void 0 : movieInfoboxElement.classList.add('is-active');
                (_a = document.querySelector('html')) === null || _a === void 0 ? void 0 : _a.classList.add('is-infobox-active');
                currentMovie.classList.remove('loading');
                document.addEventListener('keydown', this.handleEscButton);
            });
            this.handleEscButton = (event) => {
                if (event.code == 'Escape') {
                    this.closeInfobox();
                    document.removeEventListener('keydown', this.handleEscButton);
                }
            };
            this.buildMovieInfobox = (movie) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                const movieBackdrop = this.buildPoster(movie).backdrop;
                const moviePoster = this.buildPoster(movie).poster;
                const movieDate = new Date(movie.release_date);
                const htmlString = `
            <div class="movie-infobox">
                <div class="container container--sm">
                    <div class="movie-infobox__header" style="background-image: url(${this.getImageSrc(movieBackdrop.src)});" data-movie-infobox-header>
                        <div class="movie-poster">
                            ${moviePoster.image}
                        </div>
                        <div class="movie-header-info">
                            <h2>${movie.title} <span class="year">(${movieDate.getFullYear()})</span></h2>
                            <div class="movie-meta">
                                <span>${movieDate.toDateString()}</span>
                                <span> • </span>
                                <span>${(_b = movie.genres) === null || _b === void 0 ? void 0 : _b.map((x) => x.name).join(', ')}</span>
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
                            ${yield this.getTrailer(movie)}
                        </div>
                    </div>
                </div>
            </div>
        `;
                const infobox = stringToHtml(htmlString);
                this.renderClose(infobox);
                this.renderTabActions(infobox);
                return infobox;
            });
            this.renderClose = (element) => {
                var _a;
                const closeInfobox = `
            <button type="button" class="close-button"><i class="fa-solid fa-xmark"></i></button>
        `;
                const closeInfoboxElement = stringToHtml(closeInfobox);
                closeInfoboxElement.addEventListener('click', () => {
                    this.closeInfobox();
                });
                (_a = element === null || element === void 0 ? void 0 : element.querySelector('[data-movie-infobox-header]')) === null || _a === void 0 ? void 0 : _a.append(closeInfoboxElement);
            };
            this.renderTabActions = (element) => {
                var _a;
                const tabs = [];
                this.movieTabs.forEach((tab, index) => {
                    const htmlString = `
                <button type="button" ${index == 0 ? 'class="active"' : ''} data-tab-action>${tab}</button>
            `;
                    const tabAction = stringToHtml(htmlString);
                    tabAction.addEventListener('click', (event) => {
                        var _a;
                        (_a = element
                            .querySelectorAll('[data-tab-action]')) === null || _a === void 0 ? void 0 : _a.forEach((element) => element.classList.remove('active'));
                        event.target.classList.add('active');
                    });
                    tabs.push(tabAction);
                });
                (_a = element.querySelector('[data-movie-tab-actions]')) === null || _a === void 0 ? void 0 : _a.append(...tabs);
            };
            this.getTrailer = (movie) => __awaiter(this, void 0, void 0, function* () {
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
            this.buildPoster = (movie) => {
                return {
                    poster: {
                        image: `<img src="${this.getImageSrc(movie.poster_path)}" alt="${movie.title}" />`,
                        src: this.getImageSrc(movie.poster_path)
                    },
                    backdrop: {
                        image: `<img src="${this.getImageSrc(movie.backdrop_path, true)}" alt="${movie.title}" />`,
                        src: this.getImageSrc(movie.backdrop_path, true)
                    }
                };
            };
            this.closeInfobox = () => {
                var _a;
                const movieInfoboxElement = document.getElementById('movie-details');
                if (movieInfoboxElement) {
                    movieInfoboxElement.classList.remove('is-active');
                    (_a = document
                        .querySelector('html')) === null || _a === void 0 ? void 0 : _a.classList.remove('is-infobox-active');
                    setTimeout(() => {
                        movieInfoboxElement.innerHTML = '';
                    }, 400);
                }
            };
            this.getImageSrc = (imagePath, backdrop = false) => {
                let src = 'dist/assets/images/no-file-found.jpg';
                if (imagePath)
                    src = `${backdrop ? imageBackdropDefaultUrl : imageDefaultUrl}/${imagePath}`;
                return src;
            };
            this.moviesListElements = [];
            this.moviesList = [];
            this.movieTabs = ['Trailer', 'Reviews', 'Recommended'];
            document.addEventListener('click', (event) => {
                document
                    .querySelectorAll('[data-movie-id]')
                    .forEach((targetElement) => {
                    if (targetElement === event.target) {
                        this.handleMovieClick(event);
                    }
                });
            });
        }
    }

    const moviesModel = new Movies();
    function render(pagenumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const nowPlayingWrapper = document.querySelector('[data-movies-list]');
            renderSkeletonCards(nowPlayingWrapper, 20);
            try {
                const nowPlayingResponse = yield nowPlaying(pagenumber);
                if (!nowPlayingResponse.ok)
                    return false;
                const response = yield nowPlayingResponse.json();
                removeSkeletonCards(nowPlayingWrapper);
                const data = response.results;
                moviesModel.buildMovies(data);
                nowPlayingWrapper.append(...moviesModel.getMovieList());
            }
            catch (error) {
                console.error(error);
            }
        });
    }

    function initInfiniteScroll() {
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
                    const moviesListElement = document.querySelector('[data-movies-list]');
                    const moviesPage = moviesListElement &&
                        moviesListElement.getAttribute('data-movies-page')
                        ? moviesListElement.getAttribute('data-movies-page')
                        : '1';
                    const newMoviePage = parseInt(moviesPage) + 1;
                    moviesListElement === null || moviesListElement === void 0 ? void 0 : moviesListElement.setAttribute('data-movies-page', newMoviePage.toString());
                    render(newMoviePage);
                }
            });
        }, options);
        observer.observe(document.getElementById('footer'));
    }

    //Rollup need this in order to watch scss
    initInfiniteScroll();
    render();

}));
