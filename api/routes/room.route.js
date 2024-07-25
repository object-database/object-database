import {RoomController} from '../controllers/index.js';

import {Router} from "express";

export const roomRouter = Router();

roomRouter.get('/', RoomController.getRoomById);
roomRouter.get('/all', RoomController.getAllRooms);
roomRouter.post('/', RoomController.createRoom);
roomRouter.delete('/', RoomController.deleteRoom);
roomRouter.get('/timeSlots', RoomController.getTimeSlotsByRoomId);