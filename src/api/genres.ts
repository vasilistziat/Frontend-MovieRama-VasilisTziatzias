import { apiKey, defaultUrl, paths } from './constants';

export async function getGenres() {
    const response = await fetch(
        `${defaultUrl}${paths.genres}?api_key=${apiKey}&language=en-US`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response;
}
