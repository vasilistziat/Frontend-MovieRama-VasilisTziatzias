import { apiKey, defaultUrl, paths } from './constants';

export async function getMovie(movieId: string) {
    const response = await fetch(`${defaultUrl}${paths.Movie}/${movieId}?api_key=${apiKey}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

    return response;
}

export async function getMovieImages(movieId: string) {
    const response = await fetch(`${defaultUrl}${paths.Movie}/${movieId}/images?api_key=${apiKey}&language=en`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

    return response;
}