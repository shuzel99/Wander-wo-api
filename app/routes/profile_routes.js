// this boilerplate is pulled from example_routes.js
const express = require('express')
const passport = require('passport')

// pull profile database model
const Profile = require('../models/profile')
const User = require('../models/user')

// customer error messages
const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404

// sends 401 error
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const { profile } = require('console')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate router
const router = express.Router()

//  GET ALL USERS PROFILE
router.get('/profile/all', requireToken, (req, res, next) => {
    Profile.find({
        _id: {$in: req.body.userId}
    })
    .then(handle404)
    .then(foundUsers => {
        res.json(foundUsers)
    })
    .catch(err => console.log(err))
})

//  GET ONE USER PROFILE    
router.get('/profile/:userId', requireToken, (req, res, next) => {
    Profile.findOne({
        userId: req.params.userId
    })
    .then(handle404)
    .then(foundProfile => {
        res.json(foundProfile)
    })
    .catch(err => console.log(err))
})

//  CREATE USER'S PROFILE 
router.post('/profile', requireToken, (req, res, next) => {
    Profile.create({
        userId: req.user._id,
        name: req.body.name,
        picture: req.body.picture,
        bio: req.body.bio,
        locations: req.body.locations,
        likedUsersId: req.body.likedUsersId,
    })
    .then(handle404)
    .then(createdProfile => {
        res.json(createdProfile)
    })
    .catch(err => console.log(err))
})

//  EDIT USER'S PROFILE
router.patch('/profile/:userId', requireToken, removeBlanks, (req, res, next) => {
    Profile.findOneAndUpdate({userId: req.user._id},
        req.body
    )
    .then(handle404)
    .then(patchResponse => {
        res.json(patchResponse)
    })
    .catch(next)
})

//   EDIT USERS LIKED USERS
router.patch('/profile/:userId/liked', requireToken, (req, res, next) => {
    Profile.findOne({
        userId: req.user._id
    })
    .then(handle404)
    .then(foundProfile => {
        if (foundProfile.likedUsersId.includes(req.body.likedUsersId)){
            return 'You already like them!'
        } else {
            foundProfile.liked.push(req.body.likedUsersId)
            return foundProfile.save()
        }
    })
    .then(postSave => {
        res.json(postSave)
    })
    .catch(err => console.log(err))
})

//  DELETE A PROFILE 
router.delete('/profile/:userId', requireToken, (req, res, next) => {
    Profile.findOne({
        userId: req.user._id
    })
    .then(handle404)
    .then(foundProfile => {
        return foundProfile.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})



// // GET - index route displays all profile document
// router.get('/profiles', (req, res, next) => {
//     Profile.find()
//         .then((profiles) => {
//             res.status(200).json(profiles)
//         })
//         // .then((profiles) => res.status(200).json({ profiles: profiles }))
//         .catch(next)
// })

// // POST - create a profile document
// router.post('/profiles', (req, res, next) => {
//     Profile.create(req.body)
//         .then(createdProfile => {
//             res.status(201).json({ profile: createdProfile.toObject() })
//         })
//         .catch(next)
// })

// // GET - show profile belonging to user
// router.get('/profiles/:ownerId', (req,res,next) => {
//     Profile.find({owner: req.params.ownerId})
//         .then(handle404)
//         // .then(showProfile => {
//         //     requireOwnership(req, showProfile)
//         //     return showProfile
//         // })
//         .then(showProfile => res.status(200).json(showProfile))
//         .catch(next)
// })

// // PATCH - update a specific param in profile document
// router.patch('/profiles/:id', removeBlanks, requireToken, (req, res, next) => {
//     // res.json({message: 'Update a profile document'})
//     //  ADD SOON
//     // delete req.body.profile.owner 
//     console.log(req.body)
//     Profile.findById(req.params.id)
//         .then(handle404)
//         .then(profile => {
//             requireOwnership(req, profile)
//             return profile.updateOne(req.body)
//         })
//         .then(() => res.sendStatus(204))
//         .catch(next)
// })

// // DELETE - show a single profile document
// router.delete('/profiles/:id', (req, res, next) => {
//     // res.json({message: 'Delete a profile document'})
//     Profile.findById(req.params.id)
//         .then(handle404)
//         // .then(profile => {
//         //     requireOwnership(req, profile)
//         //     return profile
//         // })
//         .then(profile => {
//             profile.deleteOne()
//         })
//         .then(() => res.sendStatus(204))
//         .catch(next)
// })
module.exports = router