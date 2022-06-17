import mongoose from 'mongoose';

const notifySchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    user: {type: mongoose.Types.ObjectId, ref: 'user'},
    recipients: mongoose.Types.ObjectId,
    listing: {type: mongoose.Types.ObjectId, ref: 'post'},
    image: String,
    content: String,
    type: String,
    url: String,
    text: String,
    isRead: {type: Boolean, default: false}
}, {
    timestamps: true
})

export default mongoose.model('notify', notifySchema)