const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Starts with a letter in any language; after that, letters, spaces, apostrophes, periods and hyphens
// (e.g. "Mary Ann", "O'Brien", "Jean-Luc", "José", "St. John")
const NAME_PATTERN = /^\p{L}[\p{L}\p{M}' ’.-]*$/u;

const checkName = (field, label) =>
  check(field)
    .isString()
    .withMessage(`${label} is required.`)
    .bail()
    .trim()
    .notEmpty()
    .withMessage(`${label} is required.`)
    .bail()
    .isLength({ max: 50 })
    .withMessage(`${label} must be 50 characters or fewer.`)
    .bail()
    .matches(NAME_PATTERN)
    .withMessage(`${label} can only contain letters, spaces, hyphens, apostrophes and periods.`);

// Every field must be a string so bcrypt and the model never see numbers, arrays or objects.
const validateSignup = [
  check('email')
    .isString()
    .withMessage('Please provide a valid email.')
    .bail()
    .isEmail()
    .withMessage('Please provide a valid email.')
    .isLength({ max: 256 })
    .withMessage('Please provide a valid email.'),
  check('username')
    .isString()
    .withMessage('Please provide a username with 4 to 30 characters.')
    .bail()
    .isLength({ min: 4, max: 30 })
    .withMessage('Please provide a username with 4 to 30 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .isString()
    .withMessage('Password must be 6 characters or more.')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  checkName('firstName', 'First name'),
  checkName('lastName', 'Last name'),
  handleValidationErrors
];

router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;

      const takenBy = await User.unscoped().findAll({
        where: { [Op.or]: [{ email }, { username }] },
        attributes: ['email', 'username']
      });
      if (takenBy.length) {
        const errors = {};
        if (takenBy.some(user => user.email === email)) errors.email = 'User with that email already exists';
        if (takenBy.some(user => user.username === username)) errors.username = 'User with that username already exists';
        return res.status(409).json({ message: 'User already exists', errors });
      }

      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ email, username, hashedPassword, firstName, lastName });

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
);




module.exports = router;
