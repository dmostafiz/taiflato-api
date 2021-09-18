const { check, body, validationResult } = require('express-validator')

const rules = (req, res, next) => {
    return [
      // username must be 5 characters long
      check('username').isLength({ min: 5 }).withMessage('Username must be more than 5 characters')
      .not().isEmpty().withMessage('Username should not be empty'),
      
      check('email').isEmail().withMessage('Email is invalid.')
      .not().isEmpty().withMessage('Email should not be empty'),

      // password must be at least 8 chars long
      check('password').isLength({ min: 8 }).withMessage('Password must be more than 8 characters')
    ]
  }

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const allErrors = []
    errors.array().map(err => allErrors.push({ [err.param]: err.msg }))
  
    return res.status(422).json({
      errors: allErrors,
    })
  }

module.exports = {
    rules,
    validate,
  }