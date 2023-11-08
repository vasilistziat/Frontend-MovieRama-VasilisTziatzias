import { getReviews } from '../../api/reviews';
import fetch from 'jest-fetch-mock';

describe('getReviews', () => {
    beforeEach(() => {
        fetch.enableMocks();
    });

    test('it should test the response status to be ok with movieId 507089', async () => {
        const response = await getReviews(507089);
        expect(response.ok).toBeTruthy();
    });
});
