import Users from "../models/userModel.js";
import Posts from "../models/listingModel.js";

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const listingController = {
  searchListings: async (req, res) => {

    console.log(req.query)

    try {

      let listings = await Posts.find({$or: 
        [{name: { $regex : new RegExp(req.query.keywords, "i") }},
        {description: { $regex : new RegExp(req.query.keywords, "i") }}]
      }).limit(15);


      // if(req.query.conditions){
      //   const filteredList = listings.filter((item) => {
      //     return req.query.conditions.split(",").some((condition) => {
      //       return condition === item.condition
      //     })
      //   })

      //   listings = filteredList
      // }

      res.json({listings})
      
    } catch (err) {
      console.log(err)
      return res.status(500).json({msg: err.message})
    }
  },
  createPost: async (req, res) => {
    try {
      const {
        photos,
        name,
        description,
        category,
        subCategory,
        condition,
        currency,
        price,
        city,
        postalCode,
        user,
      } = req.body.productData;
      const { images } = req.body;

      console.log(req.body);

      if (images.length === 0) {
        return res.status(400).json({ msg: "Please add your photo." });
      }

      const newListing = new Posts({
        photos: images,
        name: name,
        description: description,
        category: category,
        subCategory: subCategory,
        condition: condition,
        currency: currency,
        price: price,
        city: city,
        postalCode: postalCode,
        user,
      });

      console.log("NEW LISTING: " + newListing);

      await newListing.save();

      res.json({
        msg: "Created Listing!",
        newListing: {
          ...newListing._doc,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getPosts: async (req, res) => {
    try {
      // const features =  new APIfeatures(Posts.find({
      //     user: [...req.user.following, req.user._id]
      // }), req.query).paginating()

      const posts = await features.query.sort("-createdAt").populate({
        populate: {
          select: "-password",
        },
      });

      res.json({
        msg: "Success!",
        result: posts.length,
        posts,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updatePost: async (req, res) => {
    try {
      const {
        photos,
        name,
        description,
        category,
        subCategory,
        condition,
        currency,
        price,
        city,
        postalCode,
        user,
      } = req.body.productData;
      const { images } = req.body;

      const listing = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          photos: images,
          name,
          description,
          category,
          subCategory,
          condition,
          currency,
          price,
          city,
          postalCode,
        }
      );

      res.json({
        msg: "Updated List!",
        newListing: {
          ...listing._doc,
          photos: images,
          name,
          description,
          category,
          subCategory,
          condition,
          currency,
          price,
          city,
          postalCode,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getCategoryListings: async (req, res) => {
    try {
      
      const listings = await Posts.find({category: req.params.id})
      .populate("user", "avatar firstName lastName");
      
      if(listings.length === 0){
        return res.status(200).json({msg: "No listings in this category"})
      }

      res.json({
        msg: "Success!",
        result: listings.length,
        listings,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  likePost: async (req, res) => {
    try {
      const post = await Posts.find({
        _id: req.params.id,
        likes: req.user._id,
      });
      if (post.length > 0)
        return res.status(400).json({ msg: "You liked this post." });

      const like = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );

      if (!like)
        return res.status(400).json({ msg: "This post does not exist." });

      res.json({ msg: "Liked Post!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unLikePost: async (req, res) => {
    try {
      const like = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );

      if (!like)
        return res.status(400).json({ msg: "This post does not exist." });

      res.json({ msg: "UnLiked Post!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserPosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Posts.find({ user: req.params.id }),
        req.query
      ).paginating();
      const listings = await features.query.sort("-createdAt");

      res.json({
        listings,
        result: listings.length,
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getPost: async (req, res) => {
    try {
      
      const item = await Posts.findById(req.params.id)
      .populate("user", "avatar firstName lastName");

      if (!item)
        return res.status(400).json({ msg: "This item does not exist." });

      res.json({
        item,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getPostsDicover: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];

      const num = req.query.num || 9;

      const posts = await Posts.aggregate([
        { $match: { user: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
      ]);

      return res.json({
        msg: "Success!",
        result: posts.length,
        posts,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deletePost: async (req, res) => {
    try {
      const post = await Posts.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
      await Comments.deleteMany({ _id: { $in: post.comments } });

      res.json({
        msg: "Deleted Post!",
        newPost: {
          ...post,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  savePost: async (req, res) => {
    try {
      const user = await Users.find({
        _id: req.user._id,
        saved: req.params.id,
      });
      if (user.length > 0)
        return res.status(400).json({ msg: "You saved this post." });

      const save = await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { saved: req.params.id },
        },
        { new: true }
      );

      if (!save)
        return res.status(400).json({ msg: "This user does not exist." });

      res.json({ msg: "Saved Post!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unSavePost: async (req, res) => {
    try {
      const save = await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { saved: req.params.id },
        },
        { new: true }
      );

      if (!save)
        return res.status(400).json({ msg: "This user does not exist." });

      res.json({ msg: "unSaved Post!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getSavePosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Posts.find({
          _id: { $in: req.user.saved },
        }),
        req.query
      ).paginating();

      const savePosts = await features.query.sort("-createdAt");

      res.json({
        savePosts,
        result: savePosts.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default listingController;
