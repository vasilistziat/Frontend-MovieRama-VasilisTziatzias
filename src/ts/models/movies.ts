import { Movie, MovieGenres } from "../interfaces/movie";
import { stringToHtml } from "../utils/dom";
import { imageBackdropDefaultUrl, imageDefaultUrl } from "../components/constants";
import {getMovie, getMovieImages} from "../requests/movie";
import { getDuration } from "utils/time";

export class Movies {
    moviesListElements: Element[];  
    movieData: Movie[];
    moviesList: Element[];
    
    constructor(moviesData: Movie[]) {
        this.moviesListElements = [];
        this.movieData = moviesData;
        this.moviesList = [];

        this.buildMovies();
    }

    buildMovies = () => {
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
    }

    handleMovieClick = async (event: Event) => {
        const currentMovie = (event.target as Element);
        const movieInfoboxElement =  document.getElementById('movie-details');
        if( !currentMovie || !currentMovie.getAttribute('data-movie-id') ) return;

        const movieDetailsResponse = await getMovie(currentMovie.getAttribute('data-movie-id')!);
        if( !movieDetailsResponse.ok ) return false;

        const response =  await movieDetailsResponse.json();
        const infoboxContent = await this.buildMovieInfobox(response);

        movieInfoboxElement?.append(infoboxContent);
        movieInfoboxElement?.classList.add('is-active');
        document.addEventListener('keydown', this.handleEscButton)
    }

    handleEscButton = (event: KeyboardEvent) => {
        if (event.code == 'Escape') {
            this.closeInfobox();
            document.removeEventListener('keydown', this.handleEscButton)
        }
    }

    buildMovieInfobox = async (movie: Movie) => {
        console.log({movie});
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
                                <span>${movie.genres?.map( x => x.name).join(', ')}</span>
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
    }

    renderClose = (element: Element) => {
        const closeInfobox = `
            <button type="button" class="close-button"><i class="fa-solid fa-xmark"></i></button>
        `;
        const closeInfoboxElement = stringToHtml(closeInfobox);
        closeInfoboxElement.addEventListener('click', () => {
            this.closeInfobox();
        });
        element?.querySelector('[data-movie-infobox-header]')?.append(closeInfoboxElement);
    }

    buildPoster = (movie: Movie) => {
        return {
            poster: {
                image: `<img src="${this.getImageSrc(movie.poster_path)}" alt="${movie.title}" />`,
                src: this.getImageSrc(movie.poster_path)
            },
            backdrop: {
                image: `<img src="${this.getImageSrc(movie.backdrop_path, true)}" alt="${movie.title}" />`,
                src: this.getImageSrc(movie.backdrop_path, true)
            }
        }
    }

    closeInfobox = () => {
        const movieInfoboxElement =  document.getElementById('movie-details');
        if( movieInfoboxElement ){
            movieInfoboxElement.classList.remove('is-active');
            setTimeout(() => {
                movieInfoboxElement.innerHTML = '';
            }, 400)
            
        }
    }

    getImageSrc = (imagePath: string, backdrop: boolean = false) => {
        return `${backdrop ? imageBackdropDefaultUrl : imageDefaultUrl}/${imagePath}`;
    }

}


