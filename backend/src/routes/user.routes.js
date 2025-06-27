import express from 'express';
import { updateProfileImage, updateUserName, updateUserEmail } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const userRoutes = express.Router();

userRoutes.put('/profile-image', authMiddleware, updateProfileImage);

userRoutes.put('/update-name', authMiddleware, updateUserName);

userRoutes.put('/update-email', authMiddleware, updateUserEmail)


export default userRoutes;
