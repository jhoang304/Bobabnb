const START_CONFLICT = 'Start date conflicts with an existing booking';
const END_CONFLICT = 'End date conflicts with an existing booking';

// Returns a Date, or null when the value is missing or can't be parsed.
const parseDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
};

const startOfTodayUTC = (now) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

// Checks the startDate/endDate in a request body. Returns an errors object keyed by field (empty when valid).
const validateBookingDates = ({ startDate, endDate }, { allowPastStart = false, now = new Date() } = {}) => {
    const errors = {};
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!startDate) errors.startDate = 'startDate is required';
    else if (!start) errors.startDate = 'startDate must be a valid date';
    else if (!allowPastStart && start < startOfTodayUTC(now)) errors.startDate = 'startDate cannot be in the past';

    if (!endDate) errors.endDate = 'endDate is required';
    else if (!end) errors.endDate = 'endDate must be a valid date';
    else if (start && end <= start) errors.endDate = 'endDate cannot be on or before startDate';

    return errors;
};

// Compares a date range against existing bookings. Both ends of a booking count as booked,
// so a new booking can't start on the day another one ends. Returns an errors object (empty when there is no conflict).
const findBookingConflicts = (bookings, startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const errors = {};

    for (const booking of bookings) {
        const bookedStart = new Date(booking.startDate).getTime();
        const bookedEnd = new Date(booking.endDate).getTime();
        if (bookedStart > end || bookedEnd < start) continue;

        const startInside = start >= bookedStart && start <= bookedEnd;
        const endInside = end >= bookedStart && end <= bookedEnd;
        const surrounds = !startInside && !endInside;
        if (startInside || surrounds) errors.startDate = START_CONFLICT;
        if (endInside || surrounds) errors.endDate = END_CONFLICT;
    }

    return errors;
};

module.exports = { parseDate, validateBookingDates, findBookingConflicts };
