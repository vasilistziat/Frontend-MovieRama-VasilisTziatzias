import { Movie } from './movie';

export interface SearchRenderParameters {
    results?: Movie[];
    pageNumber?: number;
}
