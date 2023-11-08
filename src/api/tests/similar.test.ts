import { getSimilar } from '../../api/similar';
import fetch from 'jest-fetch-mock';

describe('getSimilar', () => {
    beforeEach(() => {
        fetch.enableMocks();
    });

    test('it should test the response status to be ok with movieId 507089', async () => {
        const response = await getSimilar(507089);
        expect(response.ok).toBeTruthy();
    });
});
