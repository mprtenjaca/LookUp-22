import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    recipients: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    listing: { type: mongoose.Types.ObjectId, ref: 'post' },
    text: String,
}, {
    timestamps: true
})

export default mongoose.model('conversation', conversationSchema)