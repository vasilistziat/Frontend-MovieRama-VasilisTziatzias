import { apiKey, defaultUrl, paths } from './constants';

export async function getSimilar(movieId: number) {
    const response = await fetch(
        `${defaultUrl}${paths.movie}/${movieId}/similar?api_key=${apiKey}&language=en-US&page=1`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response;
}
