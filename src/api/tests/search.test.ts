import { getSearch } from '../../api/search';
import fetch from 'jest-fetch-mock';

describe('getSearch', () => {
    beforeEach(() => {
        fetch.enableMocks();
    });

    test('it should test the response status to be ok when search for term equalizer', async () => {
        const response = await getSearch('equalizer');
        expect(response.ok).toBeTruthy();
    });
});
