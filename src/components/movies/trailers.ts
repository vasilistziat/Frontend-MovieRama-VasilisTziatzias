export const renderTrailers = (tarilersHtml: string) => {
    const trailerTabHtml = `
        <div class="tab-content active" data-tab-body-index="1">
            <div class="trailers">
                ${tarilersHtml}
            </div>
        </div>
    `;
    return trailerTabHtml;
};
