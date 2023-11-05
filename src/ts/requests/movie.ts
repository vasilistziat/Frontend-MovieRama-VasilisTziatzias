import { apiKey, defaultUrl, paths } from './constants';

export async function getMovie(movieId: string | number) {
    const response = await fetch(
        `${defaultUrl}${paths.Movie}/${movieId}?api_key=${apiKey}&language=en`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response;
}

export async function getMovieImages(movieId: string | number) {
    const response = await fetch(
        `${defaultUrl}${paths.Movie}/${movieId}/images?api_key=${apiKey}&language=en`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response;
}

export async function getVideos(movieId: string | number) {
    const response = await fetch(
        `${defaultUrl}${paths.Movie}/${movieId}/videos?api_key=${apiKey}&language=en`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response;
}
