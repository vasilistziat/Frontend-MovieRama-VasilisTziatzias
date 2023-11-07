import { apiKey, defaultUrl, paths } from './constants';

export async function getSearch(
    query: string,
    pageNumber: number = 1,
    signal?: AbortSignal
) {
    const response = await fetch(
        `${defaultUrl}${paths.search}?query=${query}&page=${pageNumber}&api_key=${apiKey}&language=en-US`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            signal
        }
    );

    return response;
}
