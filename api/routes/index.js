import { userRouter } from './user.route.js'
import { healthRouter } from "./health.route.js"
import { Router } from 'express';

export const router = Router();

router.use('/user', userRouter);
router.use('/health', healthRouter);