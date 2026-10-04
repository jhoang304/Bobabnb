// Average star rating of a spot's reviews, or null when it has none
const averageRating = (reviews) => {
    if (!reviews || !reviews.length) return null;
    return reviews.reduce((total, review) => total + review.stars, 0) / reviews.length;
};

// URL of the image marked as the spot's preview, or null when there isn't one
const previewImageUrl = (images) => {
    const preview = (images || []).find(image => image.preview);
    return preview ? preview.url : null;
};

// Turns a spot loaded with its Reviews and SpotImages into the summary shape the spot lists return
const formatSpotSummary = (spot) => {
    const { Reviews, SpotImages, ...spotData } = spot.toJSON ? spot.toJSON() : spot;
    return {
        ...spotData,
        avgRating: averageRating(Reviews),
        previewImage: previewImageUrl(SpotImages)
    };
};

module.exports = { averageRating, previewImageUrl, formatSpotSummary };
