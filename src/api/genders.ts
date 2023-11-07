import { apiKey, defaultUrl, paths } from './constants';

export async function getGenders() {
    const response = await fetch(
        `${defaultUrl}${paths.genders}?api_key=${apiKey}&language=en-US`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response;
}
