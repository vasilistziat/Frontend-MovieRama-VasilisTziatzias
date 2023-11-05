export const stringToHtml = function (htmlString: string) {
    const parser = new DOMParser();
    return parser.parseFromString(htmlString, 'text/html').body
        .firstChild as Element;
};
