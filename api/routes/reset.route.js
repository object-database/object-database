import {ResetController} from '../controllers/index.js';

import {Router} from "express";

export const resetRouter = Router();

resetRouter.post('/', ResetController.reset);
