export const renderSkeletonCards = (
    wrapper: Element,
    numberOfCards: number = 10
) => {
    let cards = '';

    for (let i = 0; i < numberOfCards; i++) {
        cards += `<div class="skeleton-card"></div>`;
    }
    wrapper.innerHTML += cards;
};

export const removeSkeletonCards = (wrapper: Element) => {
    wrapper
        .querySelectorAll('.skeleton-card')
        .forEach((skeleton) => skeleton.remove());
};
