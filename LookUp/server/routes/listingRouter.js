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
    .delete(auth, ListingController.deleteListing)

router.route('/category/:id').get(auth, ListingController.getCategoryListings)

router.get('/user_listings/:id', auth, ListingController.getUserPosts)

router.patch('/saveListing/:id', auth, ListingController.savePost)

router.patch('/unSaveListing/:id', auth, ListingController.unSavePost)

router.patch('/updateListingStatus/:id', auth, ListingController.updateListingStatus)

router.patch('/deleteSavedListing/:id', auth, ListingController.deleteSavedListing)

router.get('/getSavedListings', auth, ListingController.getSavedListings)


export default router;