import {UserController} from '../controllers/index.js';

import {Router} from "express";

export const userRouter = Router();

userRouter.get('/', UserController.getUser);
userRouter.post('/', UserController.createUser);
userRouter.delete('/', UserController.deleteUser);
userRouter.get('/all', UserController.getAllUsers);
userRouter.get('/meeting', UserController.getUserMeetings);

