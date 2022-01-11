const mongoose = require('mongoose')
const { text } = require('stream/consumers')

const User = require('./user')

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    bio: {
        type: Text,
        required: true
    },
    locations: {
        type: Array,
        required: true
    },
    likedUsersId: {
        // Make sure this registers as an array of foreign keys instead of just one
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    owner: {
        // this links the user Id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    } 
})

module.exports = mongoose.model('Profile', profileSchema)