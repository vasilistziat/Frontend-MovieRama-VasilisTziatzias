export type Movie = {
    id: number;
    title: string;
    original_language: string;
    original_title: string;
    overview: string;
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    genres?: MovieGenres[];
    popularity: number;
    poster_path: string;
    release_date: string;
    fetchedAt: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    runtime: number;
};

type MovieGenres = {
    id: number;
    name: string;
};

export type VideosResponse = {
    results: {
        id: string;
        key: string;
        name: string;
        site: string;
        type: string;
    }[];
};
