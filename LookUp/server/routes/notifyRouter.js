import NotifyController from '../controllers/notifyController.js'
import express from 'express';
import auth from '../middleware/auth.js';
import router from './authRouter.js';


router.post('/notify', auth, NotifyController.createNotify)

router.delete('/notify/:id', auth, NotifyController.removeNotify)

router.get('/notifies', auth, NotifyController.getNotifies)

router.patch('/isReadNotify/:id', auth, NotifyController.isReadNotify)

router.delete('/deleteAllNotifies', auth, NotifyController.deleteAllNotifies)

router.delete('/deleteAllNotifiesForListing/:id', auth, NotifyController.deleteAllNotifiesForListing)

export default router;