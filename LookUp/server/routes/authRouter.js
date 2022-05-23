import AuthController from '../controllers/authController.js'
import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/test', (req, res) => {
    res.send("TEST")
});

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh_token', AuthController.generateAccessToken);

export default router;