import {MeetingController} from '../controllers/index.js';

import {Router} from "express";

export const meetingRouter = Router();

meetingRouter.get('/', MeetingController.getMeetingById);
meetingRouter.post('/', MeetingController.createMeeting);
meetingRouter.delete('/', MeetingController.deleteMeeting);
meetingRouter.get('/all', MeetingController.getAllMeetings);

