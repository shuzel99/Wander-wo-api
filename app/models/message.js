const mongoose = require('mongoose')
const { text } = require('stream/consumers')

const messageSchema = new mongoose.Schema(
    {
       conversationId:{
           type: String
       },
       sender:{
           type: String
       },
       text:{
           type: String
       },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Message', messageSchema)