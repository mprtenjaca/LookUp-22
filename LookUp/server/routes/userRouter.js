import express from 'express';
import UserController from '../controllers/userController.js';
import auth from '../middleware/auth.js';


const router = express.Router();
router.get('/search', auth, UserController.searchUser)
router.get('/user/:id', auth, UserController.getUser)
router.patch('/user', auth, UserController.updateUser)

export default router;