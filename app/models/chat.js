const mongoose = require('mongoose')
const { text } = require('stream/consumers')

const chatSchema = new mongoose.Schema(
    {
       members: {
           type: Array,
       }, 
    },
    { timestamps: true }
)

module.exports = mongoose.model('Chat', chatSchema)