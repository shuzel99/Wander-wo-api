const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema(
    {
        name: {
			type: String,
			required: true
		},
		picture: {
			type: Buffer,
		},
		bio: {
			type: String,
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
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
)

module.exports = mongoose.model('Profile', profileSchema)