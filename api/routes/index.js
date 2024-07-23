import {userRouter} from './user.route.js'
import {Router} from 'express';

export const router = Router();

router.use('/user', userRouter);