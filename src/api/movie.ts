import { apiKey, defaultUrl, paths } from './constants';

export async function getMovie(movieId: string | number) {
    const response = await fetch(
        `${defaultUrl}${paths.movie}/${movieId}?api_key=${apiKey}&language=en-US`,
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
        `${defaultUrl}${paths.movie}/${movieId}/images?api_key=${apiKey}&language=en-US`,
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
        `${defaultUrl}${paths.movie}/${movieId}/videos?api_key=${apiKey}&language=en-US`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response;
}
