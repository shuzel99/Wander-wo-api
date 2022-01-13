// this boilerplate is pulled from example_routes.js
const express = require('express')
const passport = require('passport')

// pull chat database model
const Chat = require('../models/chat')

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

// GET ALL CHATS 
router.get('/chats/all', (req, res, next) => {
    Chat.find({
        _id: {$in: req.body.userId}
    })
     .then((chats) => {
        res.json(chats)
     })
    .catch(err => console.log(err))
})

//  GET ONE CHAT
router.get('/chats/:userId/:chatId', (req, res, next) => {
    Chat.findOne({
        userId: req.params.userId
    })
    .then(handle404)
    .then(foundchat => {
        res.json(foundchat)
    })
    .catch(err => console.log(err))
})

//  CREATE CHAT
router.post('/chat/:userId', requireToken, (req, res,next) => {
    Chat.create({
        userId: req.user._id,
        likedUser: req.body.likedUser,
        messages: req.body.messages
    })    
})

// DELETE CHAT 
router.delete('/chat/:userId/:chatId', requireToken, (req, res, next) => {
    Chat.findOne({
        userId: req.user._id
    })
    .then(handle404)
    .then(foundChat => {
        return foundChat.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})



// // POST - create a chat document
// router.post('/chats', (req, res, next) => {
//     Chat.create(req.body)
//         .then(createdChat => {
//             res.status(201).json({ chat: createdChat.toObject() })
//         })
//         .catch(next)
// })

// // GET - show chats belonging to user
// router.get('/chats/:ownerId', (req,res,next) => {
//     Chat.find({owner: req.params.ownerId})
//         .then(handle404)
//         // .then(showChat => {
//         //     requireOwnership(req, showChat)
//         //     return showChat
//         // })
//         .then(showChat => res.status(200).json(showChat))
//         .catch(next)
// })

// // PATCH - update a specific param in profile document
// router.patch('/chats/:id', removeBlanks, requireToken, (req, res, next) => {
//     // res.json({message: 'Update a profile document'})
//     //  ADD SOON
//     // delete req.body.profile.owner 
//     console.log(req.body)
//     Chat.findById(req.params.id)
//         .then(handle404)
//         .then(chat => {
//             requireOwnership(req, profile)
//             return chat.updateOne(req.body)
//         })
//         .then(() => res.sendStatus(204))
//         .catch(next)
// })

// // DELETE - show a single profile document
// router.delete('/chats/:id', (req, res, next) => {
//     // res.json({message: 'Delete a profile document'})
//     Chat.findById(req.params.id)
//         .then(handle404)
//         // .then(chat => {
//         //     requireOwnership(req, chat)
//         //     return chat
//         // })
//         .then(chat => {
//            chat.deleteOne()
//         })
//         .then(() => res.sendStatus(204))
//         .catch(next)
// })
// module.exports = router