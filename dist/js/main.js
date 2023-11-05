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
            const response = yield fetch(`${defaultUrl}${paths.NowPlaying}?api_key=${apiKey}&page=${pageNumber}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            return response;
        });
    }

    const renderSkeletonCards = (wrapper, numberOfCards = 12) => {
        let cards = '';
        for (let i = 0; i < numberOfCards; i++) {
            cards += `
        <div class="skeleton-card">
            d
        </div>`;
        }
        wrapper.innerHTML = cards;
    };
    const removeSkeletonCards = (wrapper) => {
        wrapper.innerHTML = '';
    };

    const stringToHtml = function (htmlString) {
        const parser = new DOMParser();
        return parser.parseFromString(htmlString, 'text/html').body
            .firstChild;
    };

    const imageDefaultUrl = 'http://image.tmdb.org/t/p/w185';
    const imageBackdropDefaultUrl = 'http://image.tmdb.org/t/p/w1920_and_h800_multi_faces/';

    function getMovie(movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${defaultUrl}${paths.Movie}/${movieId}?api_key=${apiKey}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
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
        constructor(moviesData) {
            this.buildMovies = () => {
                this.movieData.forEach(movie => {
                    const rating = (movie.vote_average / 10) * 100;
                    const poster = this.buildPoster(movie).poster;
                    const movieDate = new Date(movie.release_date);
                    const htmlString = `
                <article class="movie-card" data-movie-id="${movie.id}">
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
                    movieHtml.addEventListener('click', this.handleMovieClick);
                    this.moviesList.push(movieHtml);
                });
            };
            this.handleMovieClick = (event) => __awaiter(this, void 0, void 0, function* () {
                const currentMovie = event.target;
                const movieInfoboxElement = document.getElementById('movie-details');
                if (!currentMovie || !currentMovie.getAttribute('data-movie-id'))
                    return;
                const movieDetailsResponse = yield getMovie(currentMovie.getAttribute('data-movie-id'));
                if (!movieDetailsResponse.ok)
                    return false;
                const response = yield movieDetailsResponse.json();
                const infoboxContent = yield this.buildMovieInfobox(response);
                movieInfoboxElement === null || movieInfoboxElement === void 0 ? void 0 : movieInfoboxElement.append(infoboxContent);
                movieInfoboxElement === null || movieInfoboxElement === void 0 ? void 0 : movieInfoboxElement.classList.add('is-active');
                document.addEventListener('keydown', this.handleEscButton);
            });
            this.handleEscButton = (event) => {
                if (event.code == 'Escape') {
                    this.closeInfobox();
                    document.removeEventListener('keydown', this.handleEscButton);
                }
            };
            this.buildMovieInfobox = (movie) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                console.log({ movie });
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
                            <h2>${movie.title} (${movieDate.getFullYear()})</h2>
                            <div class="movie-meta">
                                <span>${movieDate.toDateString()}</span>
                                <span> • </span>
                                <span>${(_a = movie.genres) === null || _a === void 0 ? void 0 : _a.map(x => x.name).join(', ')}</span>
                                <span> • </span>
                                <span>${getDuration(movie.runtime)}</span>
                            </p>
                            <p>${movie.overview}</p>
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
            </div>
        `;
                const infobox = stringToHtml(htmlString);
                this.renderClose(infobox);
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
                const movieInfoboxElement = document.getElementById('movie-details');
                if (movieInfoboxElement) {
                    movieInfoboxElement.classList.remove('is-active');
                    setTimeout(() => {
                        movieInfoboxElement.innerHTML = '';
                    }, 400);
                }
            };
            this.getImageSrc = (imagePath, backdrop = false) => {
                return `${backdrop ? imageBackdropDefaultUrl : imageDefaultUrl}/${imagePath}`;
            };
            this.moviesListElements = [];
            this.movieData = moviesData;
            this.moviesList = [];
            this.buildMovies();
        }
    }

    function renderNowPlaying() {
        return __awaiter(this, void 0, void 0, function* () {
            const nowPlayingWrapper = document.querySelector('[data-now-playing]');
            renderSkeletonCards(nowPlayingWrapper);
            try {
                const nowPlayingResponse = yield nowPlaying();
                if (!nowPlayingResponse.ok)
                    return false;
                const response = yield nowPlayingResponse.json();
                removeSkeletonCards(nowPlayingWrapper);
                const data = response.results;
                const movies = new Movies(data);
                nowPlayingWrapper.append(...movies.moviesList);
            }
            catch (error) {
                console.error(error);
            }
        });
    }

    //Rollup need this in order to watch scss
    renderNowPlaying();

}));
