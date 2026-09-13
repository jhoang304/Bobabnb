const express = require('express');
const router = express.Router();
const { Op } = require('sequelize')
const { requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

const isValidImageUrl = (value) => {
    if (!value) return false;

    try {
        const url = new URL(value);

        return (
            url.protocol === 'http:' ||
            url.protocol === 'https:'
        );
    } catch {
        return false;
    }
};

//Get all Spots owned by Current User
router.get('/current', requireAuth, async (req, res) => {
    try {
        const id = req.user.id;
        const spots = await Spot.findAll({
                where: { ownerId: id },
                include: [
                    { model: Review },
                    { model: SpotImage }
                ]
        });

        const spotsList = spots.map(spot => {
            const spotData = spot.toJSON();
            const sum = spotData.Reviews.reduce((total, review) => total + review.stars, 0);
            spotData.avgRating = sum / spotData.Reviews.length;
            delete spotData.Reviews;

            spotData.previewImage = 'none';
            const prevImg = spotData.SpotImages.find(el => el.preview === true);
            if (prevImg) {
                spotData.previewImage = prevImg.url;
            }
            delete spotData.SpotImages;

            return spotData;
        });

        const result = { Spots: spotsList };
        return res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500)
        return res.json({ error: 'Internal Server Error' });
    }
});

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;

    const reviews = await Review.findAll({
        where: { spotId: spotId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    const findSpot = await Spot.findByPk(spotId);
    if(!findSpot) {
        return res.status(404).json({message: "Spot couldn't be found"});
    };

    return res.json({Reviews: reviews});
});

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const spotId = parseInt(req.params.spotId);
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.status(404);
        return res.json({ message: "Spot couldn't be found" });
    }

    if (userId !== spot.ownerId) {
        const bookings = await Booking.findAll({
            where: {
                spotId: spotId,
            },
            attributes: ["spotId", "startDate", "endDate"],
    });
    res.json({ Bookings: bookings });
    } else {
        const bookings = await Booking.findAll({
            where: {
                spotId: spotId,
            },
            include: [{
                model: User,
                attributes: ["id", "firstName", "lastName"],
            },
        ],
    });
    res.json({ Bookings: bookings });
    }
});

// Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
    try {
        const { spotId } = req.params;
        const item = await Spot.findOne({
            where: { id: spotId },
            include: [
                { model: Review },
                {
                model: SpotImage,
                attributes: {
                    exclude: ['spotId', 'createdAt', 'updatedAt']
                }
            }
        ]
        });

        if (!item) {
            res.status(404)
            return res.json({ message: "Spot couldn't be found" });
        }

        let spot = item.toJSON();

        spot.numReviews = spot.Reviews.length;

        const sum = spot.Reviews.reduce((total, review) => total + review.stars, 0);
        spot.avgStarRating = sum / spot.Reviews.length;
        delete spot.Reviews;

        const imgHolder = spot.SpotImages;
        delete spot.SpotImages;
        spot.SpotImages = imgHolder;

        spot.Owner = await User.findByPk(spot.ownerId, {
        attributes: ['id', 'firstName', 'lastName']
        });

        return res.json(spot);
    } catch (error) {
        console.error(error);
        res.status(500)
        return res.json({ error: 'Internal Server Error' });
    }
});

// Get All Spots
router.get('/', async (req, res) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    const errors = {};
    if(page && (isNaN(page) || page < 1)) {
        errors.page = "Page must be greater than or equal to 1";
    };
    if(size && (isNaN(size) || size < 1)) {
        errors.size = "Size must be greater than or equal to 1";
    };
    if(minLat && isNaN(minLat)) {
        errors.minLat = "Minimum latitude is invalid";
    };
    if(maxLat && isNaN(maxLat)) {
        errors.maxLat = "Maximum latitude is invalid";
    };
    if(minLng && isNaN(minLng)) {
        errors.minLng = "Minimum longitude is invalid";
    };
    if(maxLng && isNaN(maxLng)) {
        errors.maxLng = "Maximum longitude is invalid";
    };
    if(minPrice && (isNaN(minPrice) || minPrice < 0)) {
        errors.minPrice = "Minimum price must be a decimal greater than or equal to 0";
    };
    if(maxPrice && (isNaN(maxPrice) || maxPrice < 0)) {
        errors.maxPrice = "Maximum price must be a decimal greater than or equal to 0";
    };

    if(Object.keys(errors).length) {
        return res.status(400).json({
            message: "Validation error",
            errors
        });
    };

    const query = {};
    if(minLat && maxLat) {
        query.lat = { [Op.between]: [minLat, maxLat] };
    } else if(minLat) {
        query.lat = { [Op.gte]: minLat };
    } else if(maxLat) {
        query.lat = { [Op.lte]: maxLat };
    }
    if(minLng && maxLng) {
        query.lng = { [Op.between]: [minLng, maxLng] };
    } else if(minLng) {
        query.lng = { [Op.gte]: minLng };
    } else if(maxLng) {
        query.lng = { [Op.lte]: maxLng };
    }
    if(minPrice && maxPrice) {
        query.price = { [Op.between]: [minPrice, maxPrice] };
    } else if(minPrice) {
        query.price = { [Op.gte]: minPrice };
    } else if(maxPrice) {
        query.price = { [Op.lte]: maxPrice };
    }

    const pagination = {};

    if(!page) page = 1;
    if(!size) size = 20;

    if(page <= 10 && size <= 20) {
        pagination.limit = size;
        pagination.offset = size * (page - 1);
    }

    const spots = await Spot.findAll({
    include: [
        { model: Review },
        {
            model: SpotImage,
            where: { preview: true }
        }
        ],
        where: query,
        ...pagination
    });

    const spotsList = spots.map(spot => {
        const spotData = spot.toJSON();
        const sum = spotData.Reviews.reduce((total, review) => total + review.stars, 0);
        spotData.avgRating = sum / spotData.Reviews.length || 0;

        const spotImage = spotData.SpotImages.find(image => image.url);
        spotData.previewImage = spotImage ? spotImage.url : 'no image found';

        delete spotData.Reviews;
        delete spotData.SpotImages;

        return spotData;
    });

    const result = { Spots: spotsList, page, size };
    return res.json(result);
});

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { url, preview } = req.body;
    const { spotId } = req.params;
    const userId = req.user.id;
    const spot = await Spot.findOne({
        where: {
        id: spotId,
        ownerId: userId
        }
    });
    const findSpot = await Spot.findByPk(spotId);

    if(!findSpot) {
        res.status(404)
        return res.json({message: "Spot couldn't be found"});
    };
    if(!spot) {
        res.status(403)
        return res.json({ message: "Only the owner can add images to this spot" });
    };
    if (!url) {
        return res.status(400).json({
            message: "Image is required"
        });
    }
    
    if (!isValidImageUrl(url)) {
        return res.status(400).json({
            message: "Invalid image URL"
        });
    }

    const newImg = await SpotImage.create({
        spotId,
        url,
        preview
    });

    const imgData = newImg.toJSON();
    const resData = {
        id: imgData.id,
        url: imgData.url,
        preview: imgData.preview
    };

    return res.json(resData);
});

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const { review, stars } = req.body;
    const spotId = parseInt(req.params.spotId);
    const userId = req.user.id;

    let reviewError;
    let starError;
    if (!review) reviewError = "Review text is required";
    if (!stars || stars < 1 || stars > 5) starError = "Stars must be an integer from 1 to 5";
    if(reviewError || starError) {
        res.status(400);
        return res.json({
            message: "Bad Request",
            errors: { reviewError, starError}
        });
    };

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        res.status(404);
        return res.json({ message: "Spot couldn't be found" });
    }

    const exists = await Review.findOne({
        where: {
            userId,
            spotId
        }
    });
    if (exists) {
        res.status(500);
        return res.json({ message: "User already has a review for this spot" });
    }

    const newReview = await Review.create({
        userId,
        spotId,
        review,
        stars
    });

    res.status(201);
    return res.json(newReview);
});

// Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;
    const userId = req.user.id;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.status(404);
        return res.json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === userId) {
        res.status(403);
        return res.json({ message: "Owner cannot book their own spot" });
    }

    if (!endDate || new Date(endDate) <= new Date(startDate)) {
        res.status(400);
        return res.json({
            message: "Bad Request",
            errors: {
            endDate: "endDate cannot be on or before startDate"
            }
        });
    }

    const currentBookings = await Booking.findAll({
        where: {
            spotId: spotId
        }
    });

    const startDateTime = new Date(startDate).getTime();
    const endDateTime = new Date(endDate).getTime();

    const conflictingBooking = currentBookings.find(booking => {
        const bookingStartDate = new Date(booking.startDate).getTime();
        const bookingEndDate = new Date(booking.endDate).getTime();

        if (bookingStartDate <= startDateTime && bookingEndDate >= startDateTime) {
            return true;
        }

        if (bookingStartDate <= endDateTime && bookingEndDate >= endDateTime) {
            return true;
        }

        return false;
    });

    if (conflictingBooking) {
        const errors = {};
        if (conflictingBooking.startDate <= startDateTime) {
            errors.startDate = "Start date conflicts with an existing booking";
        }
        if (conflictingBooking.endDate >= endDateTime) {
            errors.endDate = "End date conflicts with an existing booking";
        }

        res.status(403);
        return res.json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: errors
        });
    }

    const newBooking = await Booking.create({
    spotId: parseInt(spotId),
    userId: userId,
    startDate,
    endDate
    });

    return res.json(newBooking);
});


// Create a Spot
router.post('/', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const errors = {};
    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!country) errors.country = "Country is required";
    if (!lat || isNaN(lat)) errors.lat = "Latitude is not valid";
    if (!lng || isNaN(lng)) errors.lng = "Longitude is not valid";
    if (!name || name.length > 50) errors.name = "Name must be less than 50 characters";
    if (!description) errors.description = "Description is required";
    if (!price || price < 1) errors.price = "Price per day is required";

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors
        });
    }

    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    const safeSpot = {
        id: newSpot.id,
        ownerId: newSpot.ownerId,
        address: newSpot.address,
        city: newSpot.city,
        state: newSpot.state,
        country: newSpot.country,
        lat: newSpot.lat,
        lng: newSpot.lng,
        name: newSpot.name,
        description: newSpot.description,
        price: newSpot.price,
        createdAt: newSpot.createdAt,
        updatedAt: newSpot.updatedAt,
      };

    res.status(201)
    return res.json(safeSpot);
});

// Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findOne({
        where: {
            id: spotId,
            ownerId: req.user.id
        }
    });

    const realSpot = await Spot.findByPk(spotId);
    if (!realSpot) {
        res.status(404);
        return res.json({ message: "Spot couldn't be found" });
    }
    if (!spot) {
        res.status(403);
        return res.json({ message: "Only the owner can delete this spot" });
    }

    await spot.destroy();
    return res.json({ message: "Successfully deleted" });
});

// Edit a Spot
router.put('/:spotId', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const { spotId } = req.params;

    const exists = await Spot.findByPk(spotId);
    const spot = await Spot.findOne({
        where: {
        id: spotId,
        ownerId: req.user.id
        }
    });

    if(!exists) {
        res.status(404);
        return res.json({message: "Spot couldn't be found"});
    };
    if(!spot) {
        res.status(403);
        return res.json({message: "Only the owner can update this spot"});
    };

    const errors = {};
    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!country) errors.country = "Country is required";
    if (!lat || isNaN(lat)) errors.lat = "Latitude is not valid";
    if (!lng || isNaN(lng)) errors.lng = "Longitude is not valid";
    if (!name || name.length > 50) errors.name = "Name must be less than 50 characters";
    if (!description) errors.description = "Description is required";
    if (!price) errors.price = "Price per day is required";

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors
        });
    };

    const updatedSpot = {
        address,
        city,
        country,
        state,
        lat,
        lng,
        name,
        description,
        price,
        updatedAt: new Date()
    };

    await spot.update(updatedSpot);

    return res.json(spot);
});


module.exports = router;
