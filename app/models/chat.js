const mongoose = require('mongoose')
const { text } = require('stream/consumers')

const messageSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
},{
   timestamps: true
})

const chatSchema = new mongoose.Schema({
    likedUser: {
        // this links the user Id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, 
    userId: {
        // this links the user Id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messages: [messageSchema]
})

module.exports = mongoose.model('Chat', chatSchema)