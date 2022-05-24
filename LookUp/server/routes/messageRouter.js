import express from 'express';
import MessageController from '../controllers/messageController.js'
import auth from '../middleware/auth.js';

const router = express.Router();
router.post('/message', auth, MessageController.createMessage)
router.get('/conversations', auth, MessageController.getConversations)
router.get('/message/:id', auth, MessageController.getMessages)
router.delete('/message/:id', auth, MessageController.deleteMessages)
router.delete('/conversation/:id', auth, MessageController.deleteConversation)

export default router;