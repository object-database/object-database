import { userRouter } from './user.route.js'
import { healthRouter } from "./health.route.js"
import { Router } from 'express';
import { resetRouter } from './reset.route.js';
import {inviteRouter} from "./invite.route.js";

export const router = Router();

router.use('/user', userRouter);
router.use('/health', healthRouter);
router.use('/reset', resetRouter);
router.use('/invite', inviteRouter);