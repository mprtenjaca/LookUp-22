import ListingController from '../controllers/listingController.js'
import express from 'express';
import auth from '../middleware/auth.js';
import router from './authRouter.js';


router.route('/search').get(auth, ListingController.searchListings)

router.route('/listings')
    .post(auth, ListingController.createPost)
    .get(auth, ListingController.getPosts)

router.route('/listing/:id')
    .patch(auth, ListingController.updatePost)
    .get(auth, ListingController.getPost)
    .delete(auth, ListingController.deletePost)

router.route('/category/:id').get(auth, ListingController.getCategoryListings)

router.patch('/listing/:id/like', auth, ListingController.likePost)

router.patch('/listing/:id/unlike', auth, ListingController.unLikePost)

router.get('/user_listings/:id', auth, ListingController.getUserPosts)

router.get('/listing_discover', auth, ListingController.getPostsDicover)

router.patch('/saveListing/:id', auth, ListingController.savePost)

router.patch('/unSaveListing/:id', auth, ListingController.unSavePost)

router.get('/getSaveListings', auth, ListingController.getSavePosts)


export default router;