// this boilerplate is pulled from example_routes.js
const express = require('express')
const passport = require('passport')

// pull chat database model
const Message = require('../models/message')

// custom error messages
const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404

// sends 401 error
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate router
const router = express.Router()

// CREATE MESSAGE 
router.post('/message', async (req, res) => {
    const newMessage = new Message(req.body)
    try{
        const savedMessage = await newMessage.save()
        res.status(200).json(savedMessage)
    }catch(err){
        res.status(500).json(err)
    }
})

//GET ALL MESSAGES IN A CONVERSATION 
router.get('/message/:chatId', async (req, res) => {
    try{
        const messages = await Message.find({
            chatId: req.params.chatId,
        })
        res.status(200).json(messages)
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router