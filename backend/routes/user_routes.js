import express from 'express'
import { login, signup, checkAuth, updateProfile } from '../controllers/user_controller.js';
import { protectRoute } from '../middlewares/auth.js';

const userRouter = express.Router();


userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.put('/update-profile', protectRoute, updateProfile);
userRouter.get("/auth/check", protectRoute, checkAuth);

export default userRouter;