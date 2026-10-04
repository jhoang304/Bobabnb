const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');

const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

// Delete an Image for a Spot
router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const user = req.user.id;
    const image = await SpotImage.findByPk(imageId);

    if(!image) {
        res.status(404);
        return res.json({ message: "Spot Image couldn't be found" });
    }

    const spot = await Spot.findByPk(image.spotId);
    if(user !== spot.ownerId) {
        res.status(403);
        return res.json({ message: "Only the user can delete the image of their spot" });
    }

    await image.destroy();
    return res.json({ message: "Successfully deleted" });
})

module.exports = router;
