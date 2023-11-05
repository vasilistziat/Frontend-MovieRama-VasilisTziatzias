
export const renderSkeletonCards = (wrapper: Element, numberOfCards: number = 12) => {
    let cards = '';
    
    for (let i = 0; i < numberOfCards; i++) {
        cards += `
        <div class="skeleton-card">
            d
        </div>`
    }
    wrapper.innerHTML = cards;
}

export const removeSkeletonCards = (wrapper: Element) => {
    wrapper.innerHTML = '';
}