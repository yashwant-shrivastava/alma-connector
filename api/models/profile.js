const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    bio: {
        type: String
    },
    skills: {
        type: [String]
    },
    experiences: [
        {
            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            location: {
                type: String
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }
        }
    ],
    educations: [{
        institute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'institute',
            required: true
        },
        degree: {
            type: String,
            required: true
        },
        field: {
            type: String,
            required: true
        },
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date
        },
        current: {
            type: Boolean,
            default: false
        },
        description: {
            type: String
        }
    }],
    social: {
        facebook: {
            type: String
        },
        twitter: {
            type: String
        },
        instagram: {
            type: String
        },
        whatsapp: {
            type: Number
        },
        github: {
            type: String
        },
        youtube: {
            type: String
        },
        linkedIn: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = profile = mongoose.model('profile', profileSchema);
