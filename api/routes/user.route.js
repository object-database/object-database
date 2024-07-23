import {UserController} from '../controllers/index.js';

import {Router} from "express";

export const userRouter = Router();

userRouter.get('/', UserController.getAllUsers);
userRouter.post('/', UserController.createUser);

