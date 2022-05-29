const passport = require('passport')
const { ApiError } = require('./apiError')
const httpStatus = require('http-status')
const { role } = require('../config/role')

const verify = (req, res, resolve, reject, rights) => async (err, user) => {
    if(err || !user) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Sorry, Unauthorized request'
        ))
    }

    req.user = {
        _id: user._id,
        email:user.email,
        role: user.role,
        firstname:user.firstname,
        lastname:user.lastname,
        age:user.age,
        verified: user.verified
    }

    if(rights.length) {
        const action = rights[0] // Our actions what to do
        const resource = rights[1]
        const permission = role.can(req.user.role)[action](resource)

        if(!permission.granted) {
            return reject( new ApiError((httpStatus.FORBIDDEN, "Sorry, You can't do any changes")))
        }

        res.locals.permission = permission
    }

    resolve()
}

const auth = (...rights) => async (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', {
            sessions: false
        }, verify(req, res, resolve, reject, rights))(req, res, next)
    }).then(() => next()).catch((error) => next(error))
}

module.exports = auth