const { check, validationResult } = require('express-validator')
const httpStatus = require('http-status')

const addArticleValidator = [
    check('title')
        .trim()
        .not()
        .isEmpty()
        .withMessage('You need to add title!')
        .bail()
        .isLength({ min: 3})
        .withMessage('Minimum is 3 letters')
        .bail(),

    check('director')
        .trim()
        .not()
        .isEmpty()
        .withMessage('You need to add director!')
        .bail()
        .isLength({ min: 3})
        .withMessage('Minimum is 3 letters')
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(httpStatus.BAD_REQUEST).json({
                errors: errors.array()
            })
        }
        next()
    }
]

module.exports = {
    addArticleValidator
}