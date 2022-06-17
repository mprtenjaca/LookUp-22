import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    oib: {
        type: String
    },
    street: {
        type: String,
        default: ''
    },
    streetNumber: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    postalCode: {
        type: String,
        default: ''
    },
    county: {type: String, default: ''},
    contactPhone: {type: String, default: ''},
    password: {
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png'
    },
    role: {type: String, default: 'user'},
    saved: [{type: mongoose.Types.ObjectId, ref: 'user'}]
}, {
    timestamps: true
})

export default mongoose.model('user', userSchema)