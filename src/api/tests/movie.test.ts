import { getMovie, getVideos } from '../../api/movie';
import fetch from 'jest-fetch-mock';

describe('getMovie and getVideos', () => {
    beforeEach(() => {
        fetch.enableMocks();
    });

    test('it should test the response status to be ok with movieId 507089', async () => {
        const response = await getMovie(507089);
        expect(response.ok).toBeTruthy();
    });

    test('it should test the response status to be ok with movieId 507089', async () => {
        const response = await getVideos(507089);
        expect(response.ok).toBeTruthy();
    });
});
