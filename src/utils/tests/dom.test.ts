import { stringToHtml } from '../dom';

describe('stringToHtml', () => {
    test('it should parse a simple HTML string and return an Element', () => {
        const htmlString = '<div><p>I am movie</p></div>';
        const result = stringToHtml(htmlString);

        expect(result instanceof Element).toBe(true);
    });

    test('it should handle an empty HTML string', () => {
        const htmlString = '';
        const result = stringToHtml(htmlString);

        expect(result).toBeNull();
    });
});
