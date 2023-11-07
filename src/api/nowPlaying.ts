import { apiKey, defaultUrl, paths } from './constants';

export default async function nowPlaying(pageNumber: number = 1) {
    const response = await fetch(
        `${defaultUrl}${paths.nowPlaying}?api_key=${apiKey}&page=${pageNumber}&language=en-US`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response;
}
