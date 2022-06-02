import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Types.ObjectId, ref: 'conversation' },
    sender: { type: mongoose.Types.ObjectId, ref: 'user' },
    recipient: { type: mongoose.Types.ObjectId, ref: 'user' },
    listing: { type: mongoose.Types.ObjectId, ref: 'post' },
    text: String,
}, {
    timestamps: true
})

export default mongoose.model('message', messageSchema)