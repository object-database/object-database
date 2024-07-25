import {Router} from "express";
import {InviteController} from '../controllers/index.js';

export const inviteRouter = Router();

inviteRouter.post('/add', InviteController.inviteUsers);

