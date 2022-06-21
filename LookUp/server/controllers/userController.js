import Users from '../models/userModel.js';

const userController = {
    searchUser: async (req, res) => {
        try {
            const users = await Users.find({username: {$regex: req.query.username}})
            .limit(10).select("fullname username avatar")
            
            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id)
            if(!user) return res.status(400).json({msg: "User does not exist."})
            
            res.json({user})
        } catch (err) {
            console.log(err)
            return res.status(500).json({msg: err})
        }
    },
    updateUser: async (req, res) => {
        try {
            const { avatar, firstName, lastName, username, email, oib, street, streetNumber, postalCode, county, city, contactPhone } = req.body
            if(!firstName) return res.status(400).json({msg: "Please add your first name."})
            if(!lastName) return res.status(400).json({msg: "Please add your last name."})
            if(!username) return res.status(400).json({msg: "Please add your username."})
            if(!email) return res.status(400).json({msg: "Please add your email."})
            if(!city) return res.status(400).json({msg: "Please add city."})
            if(!postalCode) return res.status(400).json({msg: "Please add psotal code."})

            await Users.findOneAndUpdate({_id: req.user._id}, {
                avatar, firstName, lastName, username, email, oib, street, streetNumber, postalCode, county, city, contactPhone
            })

            res.json({msg: "Update Success!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    suggestionsUser: async (req, res) => {
        try {
            const newArr = [...req.user.following, req.user._id]

            const num  = req.query.num || 10

            const users = await Users.aggregate([
                { $match: { _id: { $nin: newArr } } },
                { $sample: { size: Number(num) } },
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
            ]).project("-password")

            return res.json({
                users,
                result: users.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}


export default userController