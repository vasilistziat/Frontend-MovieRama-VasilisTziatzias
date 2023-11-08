import { getGenres } from '../../api/genres';
import fetch from 'jest-fetch-mock';

describe('getGenres', () => {
    beforeEach(() => {
        fetch.enableMocks();
    });

    test('it should test the response status to be ok', async () => {
        const response = await getGenres();
        expect(response.ok).toBeTruthy();
    });
});
