import Conversations from '../models/conversationModel.js'
import Messages from '../models/messageModel.js'


class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 25
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const MessageController = {
    createMessage: async (req, res) => {
        try {
            const { sender, recipient, listing, text } = req.body
            console.log("sender: ", sender)
            console.log("recipient: ", recipient)
            console.log("listing: ", listing._id)
            if(!recipient || (!text.trim())){
                return;
            }

            const test = await Conversations.find({
                $and: [
                    {listing: listing._id},
                    {$or: [
                        {recipients: [sender, recipient]},
                        {recipients: [recipient, sender]}
                    ]},
                ]
                
            })

            // console.log("CONVO FIND: ", test)

            const newConversation = await Conversations.findOneAndUpdate({
                $and: [
                    {listing: listing._id},
                    {$or: [
                        {recipients: [sender, recipient]},
                        {recipients: [recipient, sender]}
                    ]},
                ]
                
            }, {
                recipients: [sender, recipient],
                listing,
                text
            }, { new: true, upsert: true })

            // console.log("NEW CONVO: ", newConversation)

            const newMessage = new Messages({
                conversation: newConversation._id,
                sender,
                recipient, 
                listing,
                text
            })

            console.log("NEW MESSAGE: ", newMessage)

            await newMessage.save()

            res.json({msg: 'Create Success!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getConversations: async (req, res) => {
        try {
            const features = new APIfeatures(Conversations.find({
                recipients: req.user._id
            }), req.query).paginating()

            const conversations = await features.query.sort('-updatedAt')
            .populate('recipients', 'avatar username firstName lastName')
            .populate('listing', 'name photos category price currency isSold user')

            // console.log("CONVOS: ", conversations)

            res.json({
                conversations,
                result: conversations.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getMessages: async (req, res) => {
        try {

            const features = new APIfeatures(Messages.find({

                $and: [
                    {listing: req.query.itemId},
                    {$or: [
                        {sender: req.user._id, recipient: req.params.id},
                        {sender: req.params.id, recipient: req.user._id}
                    ]},
                ],
            }), req.query ).paginating()

            const messages = await features.query.sort('-createdAt')
            .populate('listing', 'name photos category price currency isSold user')
            
            res.json({
                messages,
                result: messages.length
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({msg: err.message})
        }
    },
    deleteMessages: async (req, res) => {
        try {
            await Messages.findOneAndDelete({_id: req.params.id, sender: req.user._id})
            res.json({msg: 'Delete Success!'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteConversation: async (req, res) => {

        let deletedConversation = {}
        try {
            if(req.user._id.toString() === req.params.id){
                deletedConversation = await Conversations
                .findOneAndDelete({listing: req.query.itemId})
            }else{
                deletedConversation = await Conversations.findOneAndDelete({
                    $and: [
                        {listing: req.query.itemId},
                        {$or: [
                            {recipients: [req.user._id, req.params.id]},
                            {recipients: [req.params.id, req.user._id]}
                        ]},
                    ],
                })
            }
            if(deletedConversation){
                await Messages.deleteMany({conversation: deletedConversation._id})
            }
            
            res.json({msg: 'Delete Success!'})
        } catch (err) {
            console.log(err)
            return res.status(500).json({msg: err.message})
        }
    },
}


export default MessageController