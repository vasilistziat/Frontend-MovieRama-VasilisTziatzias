export interface Movie {
    id: number
    title: string
    original_language: string
    original_title: string
    overview:string
    adult: boolean
    backdrop_path: string
    genre_ids: number[]
    genres?: MovieGenres[]
    popularity: number
    poster_path: string
    release_date: string
    fetchedAt: string
    video: boolean
    vote_average: number
    vote_count: number,
    runtime: number
}

export interface MovieGenres {
    id: number,
    name: string
}