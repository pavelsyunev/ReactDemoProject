const mongoose = require('mongoose')
const validator = require('validator');
require('dotenv').config()

const articleSchema = mongoose.Schema({
    title: {
        type: String,
        maxLength: 200,
        required: [true, 'You need a title']
    },
    content: {
        type: String,
        required: [true, 'You need a content']
    },
    excerpt : {
        type: String,
        required: [true, 'You need a add excerpt'],
        maxLength: 500
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    actors: {
        type: [String],
        required: true,
        validate: {
            validator: function(array) {
                return array.length >= 2
            },
            message: "You mast add minimum three actors"
        }
    },
    status: {
        type: String,
        required: true,
        enum: ["draft", "public"],
        default: 'draft',
        index: true
    }
})

const Article = mongoose.model('Article', articleSchema)
module.exports = { Article }