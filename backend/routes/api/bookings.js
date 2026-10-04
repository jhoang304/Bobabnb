const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
const { parseDate, validateBookingDates, findBookingConflicts } = require('../../utils/bookings');
const { previewImageUrl } = require('../../utils/spots');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

// Get all of the Current User's Bookings
router.get("/current", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const bookings = await Booking.findAll({
        where: {
            userId: userId,
            },
            include: [
                {
                    model: Spot,
                    attributes: {
                        exclude: ["description", "createdAt", "updatedAt"]
                    },
                    include: { model: SpotImage }
                },
            ],
    });

    const bookingsList = bookings.map((booking) => {
    const bookingData = booking.toJSON();
    if (bookingData.Spot) {
        bookingData.Spot.previewImage = previewImageUrl(bookingData.Spot.SpotImages);
        delete bookingData.Spot.SpotImages;
    }
    return bookingData;
    });

    res.json({ Bookings: bookingsList });
});

//Edit a Booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;
    const user = req.user.id;
    const booking = await Booking.findByPk(bookingId);

    if(!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" })
    };

    if(booking.userId !== user) {
        return res.status(403).json({
            message: "Only the user can edit their booking"
        });
    };

    // A stay that has already started can keep its start date, e.g. to extend the end date.
    const newStart = parseDate(startDate);
    const startUnchanged = !!newStart && newStart.getTime() === new Date(booking.startDate).getTime();
    const dateErrors = validateBookingDates({ startDate, endDate }, { allowPastStart: startUnchanged });
    if (Object.keys(dateErrors).length) {
        res.status(400);
        return res.json({
            message: "Bad Request",
            errors: dateErrors
        });
    };

    const present = new Date();
    if (present.getTime() > new Date(booking.endDate).getTime()) {
      res.status(403);
      return res.json({
          message: "Past bookings can't be modified"
      });
    }

    const otherBookings = await Booking.findAll({
        where: {
            spotId: booking.spotId,
            id: { [Op.ne]: booking.id }
        }
    });

    const conflicts = findBookingConflicts(otherBookings, startDate, endDate);
    if (Object.keys(conflicts).length) {
        res.status(403);
        return res.json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: conflicts
        });
    }

    const updatedBooking = {
        startDate,
        endDate,
        updatedAt: new Date()
    };
    await booking.update(updatedBooking);
    return res.json(booking);
});

// Delete a Booking
router.delete("/:bookingId", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const bookingId = parseInt(req.params.bookingId);
    let booking = await Booking.findByPk(bookingId);

    if (!booking) {
        res.status(404);
        return res.json({ message: "Booking couldn't be found" });
    }

    let spot = await Spot.findByPk(booking.spotId);
    const currentDate = new Date();

    if (userId === booking.userId || userId === spot.ownerId) {
        let bookingStartDate = new Date(new Date(booking.dataValues.startDate).toUTCString());
        if (bookingStartDate.getTime() < currentDate.getTime()) {
            res.status(403);
            return res.json({ message: "Bookings that have been started can't be deleted" });
        }
        await booking.destroy();
        res.json({ message: "Successfully deleted" });
    } else {
        res.status(403);
        return res.json({ message: "Booking must belong to the current user or the Spot must belong to the current user" });
    }
});


module.exports = router;
