const httpStatus = require('http-status')
const { ApiError } = require('../middleware/apiError')

const { userService, authService, emailService } = require('../services')

const userController = {
    // Profile
    async profile(req, res, next) {
        try {
            const user = await userService.findUserById(req.user._id)
            if(!user) {
                throw new ApiError(httpStatus.NOT_FOUND, 'Sorry, User not found')
            }

            res.json(res.locals.permission.filter(user._doc))

        } catch(error) {
            next(error)
        }
    },
    // Update user profile
    async updateProfile(req, res, next) {
        try {
            const user = await userService.updateUserProfile(req)
            res.json(res.locals.permission.filter(user._doc))

        } catch(error) {
            next(error)
        }
    },
    // Update user email
    async updateUserEmail(req, res, next) {
        try {
            const user = await userService.updateUserEmail(req)
            const token = await authService.genAuthToken(user)

            // Send link to user email to verify it
            await emailService.registerEmail(user.email, user)

            return res.cookie('x-access-token', token)
                .send({
                    user: res.locals.permission.filter(user._doc)
                })

        } catch(error) {
            next(error)
        }
    },
    //Verify account
    async verifyAccount(req, res, next) {
        try {
            const token = userService.validateToken(req.query.validation)
            const user = await userService.findUserById(token.sub)

            if(!user) {
                throw new ApiError(httpStatus.NOT_FOUND, 'Sorry, User not found')
            }

            if(user.verified) {
                throw new ApiError(httpStatus.NOT_FOUND, 'Sorry, Account already verified')
            }

            user.verified = true
            user.save()
            res.status(httpStatus.CREATED).send({
                email: user.email,
                verified: true
            })

        } catch(error) {
            next(error)
        }
    }
}

module.exports = userController