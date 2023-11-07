import { getDuration } from '../time';

describe('getDuration', () => {
    test('it should correctly format a time in minutes into a string', () => {
        const timeInMinutes = 142; // 2 hours and 22 minutes
        const result = getDuration(timeInMinutes);
        expect(result).toBe('2h 22m');
    });

    test('it should handle time less than an hour', () => {
        const timeInMinutes = 30; // 30 minutes
        const result = getDuration(timeInMinutes);
        expect(result).toBe('0h 30m');
    });

    test('it should handle time exactly one hour', () => {
        const timeInMinutes = 60; // 1 hour
        const result = getDuration(timeInMinutes);
        expect(result).toBe('1h 0m');
    });
});
