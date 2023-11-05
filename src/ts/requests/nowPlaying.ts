import { apiKey, defaultUrl, paths } from './constants';

export default async function nowPlaying(pageNumber: number = 1) {
    const response = await fetch(`${defaultUrl}${paths.NowPlaying}?api_key=${apiKey}&page=${pageNumber}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

    return response;
}