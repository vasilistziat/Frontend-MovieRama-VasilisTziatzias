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

export type MovieGenres = {
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

export type Review = {
    author: string;
    author_details: {
        avatar_path: string;
        name: string;
        rating: number;
        username: string;
    };
    content: string;
    created_at: string;
    id: string;
    updated_at: string;
    url: string;
};
