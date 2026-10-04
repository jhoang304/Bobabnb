const { test } = require('node:test');
const assert = require('node:assert/strict');
const { averageRating, previewImageUrl, formatSpotSummary } = require('./spots');

test('averageRating is null when there are no reviews', () => {
    assert.equal(averageRating([]), null);
    assert.equal(averageRating(undefined), null);
});

test('averageRating averages the stars', () => {
    assert.equal(averageRating([{ stars: 5 }, { stars: 4 }]), 4.5);
    assert.equal(averageRating([{ stars: 3 }]), 3);
});

test('previewImageUrl returns the preview image or null', () => {
    const images = [
        { url: 'https://example.com/other.jpg', preview: false },
        { url: 'https://example.com/preview.jpg', preview: true }
    ];
    assert.equal(previewImageUrl(images), 'https://example.com/preview.jpg');
    assert.equal(previewImageUrl([{ url: 'https://example.com/other.jpg', preview: false }]), null);
    assert.equal(previewImageUrl([]), null);
    assert.equal(previewImageUrl(undefined), null);
});

test('formatSpotSummary replaces Reviews and SpotImages with avgRating and previewImage', () => {
    const spot = {
        id: 1,
        name: 'Teahouse',
        Reviews: [{ stars: 4 }, { stars: 5 }],
        SpotImages: [{ url: 'https://example.com/preview.jpg', preview: true }]
    };
    assert.deepEqual(formatSpotSummary(spot), {
        id: 1,
        name: 'Teahouse',
        avgRating: 4.5,
        previewImage: 'https://example.com/preview.jpg'
    });
});

test('formatSpotSummary uses null for a spot with no reviews or images', () => {
    const summary = formatSpotSummary({ id: 2, Reviews: [], SpotImages: [] });
    assert.deepEqual(summary, { id: 2, avgRating: null, previewImage: null });
});

test('formatSpotSummary accepts a Sequelize instance', () => {
    const instance = { toJSON: () => ({ id: 3, Reviews: [{ stars: 2 }], SpotImages: [] }) };
    assert.deepEqual(formatSpotSummary(instance), { id: 3, avgRating: 2, previewImage: null });
});
