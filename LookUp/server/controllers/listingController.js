import Users from "../models/userModel.js";
import Posts from "../models/listingModel.js";

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 25;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  paginatingListings() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const listingController = {
  searchListings: async (req, res) => {

    try {
      let listings = await Posts.find({
        
        $and: [
          {isSold: false},
          {$or: [
            { name: 
              { $regex: new RegExp(req.query.keywords, "i") } }, 
              { description: { $regex: new RegExp(req.query.keywords, "i") } 
            }]}
        ]
      }).limit(15);

      // if(req.query.conditions){
      //   const filteredList = listings.filter((item) => {
      //     return req.query.conditions.split(",").some((condition) => {
      //       return condition === item.condition
      //     })
      //   })

      //   listings = filteredList
      // }

      res.json({ listings });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },
  createPost: async (req, res) => {
    try {
      const { photos, name, description, category, subCategory, condition, currency, price, city, postalCode, user } = req.body.productData;
      const { images } = req.body;

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
      const { photos, name, description, category, subCategory, condition, currency, price, city, postalCode, user } = req.body.productData;
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
      const listings = await Posts.find(
        {$and: [
          { category: req.params.id }, 
          { isSold: false }
        ]}).populate("user", "avatar firstName lastName");

      if (listings.length === 0) {
        return res.status(200).json({ msg: "No listings in this category" });
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
  getUserPosts: async (req, res) => {
    try {
      const features = new APIfeatures(Posts.find({ user: req.params.id }), req.query).paginatingListings();
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
      const item = await Posts.findById(req.params.id).populate("user", "avatar firstName lastName");

      if (!item) {
        return res.status(400).json({ msg: "This item does not exist." });
      }

      res.json({
        item,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteListing: async (req, res) => {
    try {
      const deletedListing = await Posts.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      res.json({
        msg: "Deleted Post!",
        deletedListing: {
          ...deletedListing,
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
      if (user.length > 0) {
        return res.status(400).json({ msg: "You saved this listing." });
      }
      const save = await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { saved: req.params.id },
        },
        { new: true }
      );

      if (!save) {
        return res.status(400).json({ msg: "This user does not exist." });
      }
      res.json({ msg: "Saved Listing!" });
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

      if (!save) {
        return res.status(400).json({ msg: "This user does not exist." });
      }
      res.json({ msg: "Unsaved Listing!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateListingStatus: async (req, res) => {
    try {
      const updatedListing = await Posts
      .findOneAndUpdate({ _id: req.params.id }, 
        [{$set: {isSold: {$eq:[false, "$isSold"]}}}], 
        { new: true })
      .populate("user", "avatar firstName lastName");
      
      if (!updatedListing) {
        return res.status(400).json({ msg: "This listing does not exist." });
      }

      res.json({
        msg: `Updated listing status to ${updatedListing.isSold ? "sold" : "selling"}`,
        updatedListing,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getSavedListings: async (req, res) => {
    try {
      const features = new APIfeatures(
        Posts.find({
          _id: { $in: req.user.saved },
        }),
        req.query
      ).paginating();

      const savedListings = await features.query.sort("-createdAt");

      res.json({
        savedListings,
        result: savedListings.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteSavedListing: async (req, res) => {
    try {
      const deleted = await Users.updateMany(
        { saved: req.params.id },
        {
          $pull: { saved: req.params.id },
        },
        { new: true }
      );

      if (!deleted) {
        return res.status(400).json({ msg: "Error while trying to remove all saved listings with ID: " + req.params.id });
      }
      res.json({ msg: "Removed all saved listings with ID: " + req.params.id });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default listingController;
