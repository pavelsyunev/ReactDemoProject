const { User } = require('../models/user')
const { ApiError } = require('../middleware/apiError')
const httpStatus = require('http-status')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const findUserByEmail = async (email) => {
    const user = await User.findOne({ email })
    return user
}

const findUserById = async (_id) => {
    const id = await User.findOne({ _id })
    return id
}

const updateUserProfile = async (req) => {
    try {
        const user = await User.findOneAndUpdate(
            {
            _id: req.user._id
            },
    {
            "$set": {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                age: req.body.age,
                }
            },
            {
                new: true
            })

        if(!user) {
            throw new ApiError(httpStatus.NOT_FOUND, "Sorry, User not found")
        }

        return user


    } catch(error) {
        throw error
    }

}

const updateUserEmail = async (req) => {
    try {
        if(await User.emailTaken(req.body.newemail)) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Sorry, Email already taken!')
        }

        const user = await User.findOneAndUpdate(
            {
                _id: req.user._id,
                email: req.user.email
            },
            {
                "$set": {
                    email: req.body.newemail,
                    verified: false
                }
            },
            {
                new: true
            })

        if(!user) {
            throw new ApiError(httpStatus.NOT_FOUND, "Sorry, User not found")
        }

        return user

    } catch(error) {
        throw error
    }
}

const validateToken = (token) => {
    return jwt.verify(token, process.env.DB_SECRET)
}

module.exports = {
    findUserByEmail,
    findUserById,
    updateUserProfile,
    updateUserEmail,
    validateToken
}