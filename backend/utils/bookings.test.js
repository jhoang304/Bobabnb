const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateBookingDates, findBookingConflicts } = require('./bookings');

const START_CONFLICT = 'Start date conflicts with an existing booking';
const END_CONFLICT = 'End date conflicts with an existing booking';

// Existing booking: Jan 10 to Jan 15
const existing = [{ startDate: new Date('2030-01-10'), endDate: new Date('2030-01-15') }];
const conflicts = (start, end, bookings = existing) => findBookingConflicts(bookings, start, end);

test('no conflict for a range entirely before an existing booking', () => {
    assert.deepEqual(conflicts('2030-01-01', '2030-01-05'), {});
});

test('no conflict for a range entirely after an existing booking', () => {
    assert.deepEqual(conflicts('2030-01-20', '2030-01-25'), {});
});

test('no conflict when the range ends the day before or starts the day after', () => {
    assert.deepEqual(conflicts('2030-01-05', '2030-01-09'), {});
    assert.deepEqual(conflicts('2030-01-16', '2030-01-20'), {});
});

test('partial overlap at the start of an existing booking flags endDate', () => {
    assert.deepEqual(conflicts('2030-01-08', '2030-01-12'), { endDate: END_CONFLICT });
});

test('partial overlap at the end of an existing booking flags startDate', () => {
    assert.deepEqual(conflicts('2030-01-13', '2030-01-18'), { startDate: START_CONFLICT });
});

test('a range that surrounds an existing booking flags both dates', () => {
    assert.deepEqual(conflicts('2030-01-01', '2030-01-31'), { startDate: START_CONFLICT, endDate: END_CONFLICT });
});

test('a range inside an existing booking flags both dates', () => {
    assert.deepEqual(conflicts('2030-01-11', '2030-01-14'), { startDate: START_CONFLICT, endDate: END_CONFLICT });
});

test('an identical range flags both dates', () => {
    assert.deepEqual(conflicts('2030-01-10', '2030-01-15'), { startDate: START_CONFLICT, endDate: END_CONFLICT });
});

test('both ends of a booking count as booked', () => {
    assert.deepEqual(conflicts('2030-01-15', '2030-01-20'), { startDate: START_CONFLICT });
    assert.deepEqual(conflicts('2030-01-05', '2030-01-10'), { endDate: END_CONFLICT });
});

test('checks every booking, not just the first conflict', () => {
    const bookings = [
        { startDate: new Date('2030-01-01'), endDate: new Date('2030-01-05') },
        { startDate: new Date('2030-01-10'), endDate: new Date('2030-01-15') }
    ];
    assert.deepEqual(conflicts('2030-01-04', '2030-01-12', bookings), { startDate: START_CONFLICT, endDate: END_CONFLICT });
});

test('no bookings means no conflict', () => {
    assert.deepEqual(conflicts('2030-01-01', '2030-01-05', []), {});
});

const now = new Date('2030-01-10T15:00:00Z');
const validate = (body, options = {}) => validateBookingDates(body, { now, ...options });

test('accepts valid future dates', () => {
    assert.deepEqual(validate({ startDate: '2030-02-01', endDate: '2030-02-05' }), {});
});

test('accepts a start date of today', () => {
    assert.deepEqual(validate({ startDate: '2030-01-10', endDate: '2030-01-12' }), {});
});

test('requires startDate and endDate', () => {
    assert.deepEqual(validate({}), { startDate: 'startDate is required', endDate: 'endDate is required' });
});

test('rejects dates that do not parse', () => {
    assert.deepEqual(validate({ startDate: 'soon', endDate: 'later' }), {
        startDate: 'startDate must be a valid date',
        endDate: 'endDate must be a valid date'
    });
});

test('rejects a start date in the past unless allowed', () => {
    const body = { startDate: '2030-01-09', endDate: '2030-01-12' };
    assert.deepEqual(validate(body), { startDate: 'startDate cannot be in the past' });
    assert.deepEqual(validate(body, { allowPastStart: true }), {});
});

test('rejects an end date on or before the start date', () => {
    const message = { endDate: 'endDate cannot be on or before startDate' };
    assert.deepEqual(validate({ startDate: '2030-02-05', endDate: '2030-02-05' }), message);
    assert.deepEqual(validate({ startDate: '2030-02-05', endDate: '2030-02-01' }), message);
});
