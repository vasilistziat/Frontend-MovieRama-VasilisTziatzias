import { avatarDefaultUrl } from 'components/constants';
import { Review } from 'types/movie';

export const renderReviews = (reviewsResponse: Review[]) => {
    if (!reviewsResponse.length) return '';

    const reviewsList: string[] = [];

    reviewsResponse.forEach((review) => {
        const reviewDate = new Date(review.created_at);
        const html = `
        <div class="review">
            <div class="review__header">
                <div class="review__avatar">
                    <img src="${getAvatar(
                        review.author_details.avatar_path
                    )}" alt="${review.author}" />
                </div>
                <div class="review__meta">
                    <h4>${review.author}</h4>
                    <span class="published-date">Published at: ${reviewDate.toLocaleString()}</span>
                </div>
            </div>
            <div class="review__content">
                <p>${review.content}</p>
            </div>
        </div>
        `;
        reviewsList.push(html);
    });

    const reviewsTabHtml = `<div class="tab-content tab-content--reviews" data-tab-body-index="2">${reviewsList.join(
        ''
    )}</div>`;

    return reviewsTabHtml;
};

const getAvatar = (avatar: string | null) => {
    let authorAvatar = 'dist/assets/images/avatar_placeholder.jpg';

    if (avatar) authorAvatar = `${avatarDefaultUrl}${avatar}`;

    return authorAvatar;
};
