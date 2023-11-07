import { Movie } from 'types/movie';
import { getMovieAssets } from './media';

export const renderSimilar = (similarResponse: Movie[]) => {
    if (!similarResponse.length) return '';

    const similarList: string[] = [];

    similarResponse.forEach((movie) => {
        const backdrop = getMovieAssets(movie).backdrop;
        const rating = (movie.vote_average / 10) * 100;
        const movieDate = new Date(movie.release_date);
        const html = `
        <article class="movie-card movie-card--similar" data-movie-id="${
            movie.id
        }" style="background-image: url(${backdrop.src})">
            <div class="loader"><i class="fa-solid fa-circle-notch"></i></div>
            <div class="movie-card__details">
                <div class="movie-rating">
                    <div class="movie-rating__stars">
                        <i class="fa-regular fa-star empty"></i>
                        <i class="fa-solid fa-star full" style="width: ${rating}%"></i>
                    </div>
                    <span class="movie-rating__number">${movie.vote_average.toFixed(
                        1
                    )}</span>
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

    const reviewsTabHtml = `
    <div class="tab-content" data-tab-body-index="3">
        <div class="similar-list">${similarList.join('')}</div>
    </div>
    `;

    return reviewsTabHtml;
};
