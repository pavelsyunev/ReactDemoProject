const express = require('express')
const app = express()
require('dotenv').config()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')

const routes = require('./routes')

const passport = require('passport')
const { jwtStrategy } = require('./middleware/paspport')
const { handleError, convertToApiError } = require('./middleware/apiError')

// const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3hu0m.mongodb.net/?retryWrites=true&w=majority`
const mongoUri = 'mongodb+srv://admin:3541516354@cluster0.3hu0m.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoUri)

// Parsing
app.use(bodyParser.json())

// Sanitize
app.use(xss())
app.use(mongoSanitize())

// Passport
app.use(passport.initialize())
passport.use('jwt', jwtStrategy)

// Routes
app.use('/api', routes)

// Error handling
app.use(convertToApiError)
app.use((err, req, res, next) => {
    handleError(err, res)
})

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})