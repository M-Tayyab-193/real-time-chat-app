import express from 'express'
import { login, signup } from '../controllers/user_controller.js';
import { protectRoute } from '../middlewares/auth.js';

const userRouter = express.Router();


userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.put('/update-profile', protectRoute, login);

export default userRouter;