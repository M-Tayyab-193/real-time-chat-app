import express from 'express'

import { protectRoute } from '../middlewares/auth.js';
import { getAllMessages, getUsersForChats, markMessageAsSeen, sendMessage } from '../controllers/message_controller.js';

const messageRouter = express.Router();

messageRouter.get('/users', protectRoute, getUsersForChats);
messageRouter.get('/:id', protectRoute, getAllMessages);
messageRouter.put('mark/:id', protectRoute, markMessageAsSeen);
messageRouter.post('/send/:id', protectRoute, sendMessage);


export default messageRouter;