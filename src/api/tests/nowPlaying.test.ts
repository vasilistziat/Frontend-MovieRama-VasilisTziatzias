import nowPlaying from '../../api/nowPlaying';
import fetch from 'jest-fetch-mock';

describe('nowPlaying', () => {
    beforeEach(() => {
        fetch.enableMocks();
    });

    test('it should test the response status to be ok', async () => {
        const response = await nowPlaying();
        expect(response.ok).toBeTruthy();
    });
});
