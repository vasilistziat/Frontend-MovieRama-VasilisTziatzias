import { apiKey, defaultUrl, paths } from './constants';

export async function getReviews(movieId: number) {
    const response = await fetch(
        `${defaultUrl}${paths.movie}/${movieId}/reviews?api_key=${apiKey}&language=en-US`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response;
}
