import { Movie, VideosResponse } from '../types/movie';
import { stringToHtml } from '../utils/dom';
import {
    imageBackdropDefaultUrl,
    imageDefaultUrl
} from '../components/constants';
import { getMovie, getMovieImages, getVideos } from '../requests/movie';
import { getDuration } from 'utils/time';

export class Movies {
    moviesListElements: Element[];
    moviesList: Element[];
    movieTabs: string[];

    constructor() {
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

    buildMovies = (moviesData: Movie[]) => {
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

    getMovieList = () => {
        const list = this.moviesList;
        this.moviesList = [];
        return list;
    };

    handleMovieClick = async (event: Event) => {
        const currentMovie = event.target as Element;
        const movieInfoboxElement = document.getElementById('movie-details');
        if (!currentMovie || !currentMovie.getAttribute('data-movie-id'))
            return;

        currentMovie.classList.add('loading');

        const movieDetailsResponse = await getMovie(
            currentMovie.getAttribute('data-movie-id')!
        );
        if (!movieDetailsResponse.ok) return false;

        const response = await movieDetailsResponse.json();
        const infoboxContent = await this.buildMovieInfobox(response);

        movieInfoboxElement?.append(infoboxContent);
        movieInfoboxElement?.classList.add('is-active');
        document.querySelector('html')?.classList.add('is-infobox-active');
        currentMovie.classList.remove('loading');
        document.addEventListener('keydown', this.handleEscButton);
    };

    handleEscButton = (event: KeyboardEvent) => {
        if (event.code == 'Escape') {
            this.closeInfobox();
            document.removeEventListener('keydown', this.handleEscButton);
        }
    };

    buildMovieInfobox = async (movie: Movie) => {
        const movieBackdrop = this.buildPoster(movie).backdrop;
        const moviePoster = this.buildPoster(movie).poster;
        const movieDate = new Date(movie.release_date);
        const htmlString = `
            <div class="movie-infobox">
                <div class="container container--sm">
                    <div class="movie-infobox__header" style="background-image: url(${this.getImageSrc(
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
                            ${await this.getTrailer(movie)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const infobox = stringToHtml(htmlString);
        this.renderClose(infobox);
        this.renderTabActions(infobox);

        return infobox;
    };

    renderClose = (element: Element) => {
        const closeInfobox = `
            <button type="button" class="close-button"><i class="fa-solid fa-xmark"></i></button>
        `;
        const closeInfoboxElement = stringToHtml(closeInfobox);
        closeInfoboxElement.addEventListener('click', () => {
            this.closeInfobox();
        });
        element
            ?.querySelector('[data-movie-infobox-header]')
            ?.append(closeInfoboxElement);
    };

    renderTabActions = (element: Element) => {
        const tabs: Element[] = [];
        this.movieTabs.forEach((tab, index) => {
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

    getTrailer = async (movie: Movie) => {
        const response = await getVideos(movie.id);
        if (!response.ok) return false;

        const videosResponse = (await response.json()) as VideosResponse;
        const trailers = videosResponse.results.filter(
            (video) => video.type == 'Trailer'
        );
        if (!!videosResponse.results.length && !!trailers.length) {
            const trailersString: string[] = [];
            trailers.forEach((trailer) => {
                trailersString.push(`
                    <div class="responsive-iframe-video">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailer.key}" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                `);
            });
            return trailersString.join('');
        } else {
            return 'No trailer found';
        }
    };

    buildPoster = (movie: Movie) => {
        return {
            poster: {
                image: `<img src="${this.getImageSrc(
                    movie.poster_path
                )}" alt="${movie.title}" />`,
                src: this.getImageSrc(movie.poster_path)
            },
            backdrop: {
                image: `<img src="${this.getImageSrc(
                    movie.backdrop_path,
                    true
                )}" alt="${movie.title}" />`,
                src: this.getImageSrc(movie.backdrop_path, true)
            }
        };
    };

    closeInfobox = () => {
        const movieInfoboxElement = document.getElementById('movie-details');
        if (movieInfoboxElement) {
            movieInfoboxElement.classList.remove('is-active');
            document
                .querySelector('html')
                ?.classList.remove('is-infobox-active');
            setTimeout(() => {
                movieInfoboxElement.innerHTML = '';
            }, 400);
        }
    };

    getImageSrc = (imagePath: string, backdrop: boolean = false) => {
        let src = 'dist/assets/images/no-file-found.jpg';

        if (imagePath)
            src = `${
                backdrop ? imageBackdropDefaultUrl : imageDefaultUrl
            }/${imagePath}`;

        return src;
    };
}
