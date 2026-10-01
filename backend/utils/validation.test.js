const { test } = require('node:test');
const assert = require('node:assert/strict');
const { check } = require('express-validator');
const { handleValidationErrors } = require('./validation');

const validatePassword = check('password').isLength({ min: 6 }).withMessage('Password must be 6 characters or more.');

// Runs the validator on a fake request, then the middleware, and records every call to next().
const run = async (body) => {
    const req = { body };
    await validatePassword.run(req);
    const calls = [];
    handleValidationErrors(req, {}, (...args) => calls.push(args));
    return calls;
};

test('calls next() once with no arguments when validation passes', async () => {
    const calls = await run({ password: 'secret password' });
    assert.deepEqual(calls, [[]]);
});

test('calls next() only once, with a 400 error, when validation fails', async () => {
    const calls = await run({ password: 'short' });
    assert.equal(calls.length, 1);

    const [err] = calls[0];
    assert.ok(err instanceof Error);
    assert.equal(err.status, 400);
    assert.equal(err.title, 'Bad request.');
    assert.deepEqual(err.errors, { password: 'Password must be 6 characters or more.' });
});
