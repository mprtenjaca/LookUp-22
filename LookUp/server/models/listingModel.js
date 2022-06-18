import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    photos: {
        type: Array,
        required: false
    },
    name: {
        type: String,
        default: '',
        trim: true,
    },
    description: {
        type: String,
        default: '',
        trim: true,
    },
    isSold: {type: Boolean, default: false},
    category: {type: String, default: '', trim: true,},
    subCategory: {type: String, default: '', trim: true,},
    condition: {type: String, default: '', trim: true,},
    currency: {type: String, default: '', trim: true,},
    price: {type: String, default: '', trim: true,},
    city: {type: String, default: '', trim: true,},
    postalCode: {type: String, default: '', trim: true,},
    user: {type: mongoose.Types.ObjectId, ref: 'user'}
}, {
    timestamps: true
})

export default mongoose.model('post', postSchema)