const { body } = require('express-validator');

const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Username must be between 3 and 10 characters long.'),
  body('password')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Password must be between 3 and 10 characters long.'),
];

module.exports = validateRegister;
