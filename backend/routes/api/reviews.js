const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { previewImageUrl } = require('../../utils/spots');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

// Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    const id = req.user.id;
    const reviews = await Review.findAll({
        where: { userId: id },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt']
                },
                include: { model: SpotImage }
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    const reviewsList = reviews.map(review => {
        const reviewData = review.toJSON();
        const spot = reviewData.Spot;
        spot.previewImage = previewImageUrl(spot.SpotImages);
        delete spot.SpotImages;
        return reviewData;
    });

    return res.json({Reviews: reviewsList});
});

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    const user = req.user.id;
    const review = await Review.findByPk(reviewId);

    if(!review) {
        res.status(404);
        return res.json({ message: "Review couldn't be found" });
    };
    if(user !== review.userId) {
        res.status(403);
        return res.json({ message: "Only the owner can add images to this review" });
    };
    if(!url) {
        res.status(400);
        return res.json({
            message: "Bad Request",
            errors: { url: "Image URL is required" }
        });
    };

    const imageCount = await ReviewImage.count({ where: { reviewId: review.id } });
    if(imageCount >= 10) {
        res.status(403);
        return res.json({ "message": "Maximum number of images for this resource was reached" });
    }

    const newRevImg = await ReviewImage.create({
        reviewId,
        url
    });

    const newImg = await ReviewImage.findOne({
        where: { id: newRevImg.id },
        attributes: ['id', 'url']
    })

    return res.json(newImg)
});

// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const user = req.user.id;
    const userReview = await Review.findByPk(reviewId);

    if(!userReview) {
        res.status(404);
        return res.json({ message: "Review couldn't be found" });
    }

    //must be current user
    if(user !== userReview.userId) {
        res.status(403);
        return res.json({ message: "Only the owner can delete this review" });
    };

    await userReview.destroy();

    return res.json({ message: "Successfully deleted" });
});

// Edit a Review
router.put('/:reviewId', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const user = req.user.id;
    const userReview = await Review.findByPk(reviewId);

    if(!userReview) {
        res.status(404);
        return res.json({ "message": "Review couldn't be found" });
    }

    if(user !== userReview.userId) {
        res.status(403);
        return res.json({ message: "Only the owner can update this review" });
    };

    const errors = {};
    if(!review) errors.review = "Review text is required";
    if(!stars || stars < 1 || stars > 5) errors.stars = "Stars must be an integer from 1 to 5";
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors
        });
    };

    const updatedRev = {
        review,
        stars,
        updatedAt: new Date()
    };
    await userReview.update(updatedRev);

    return res.json(userReview);
});

module.exports = router;
