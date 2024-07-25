import {StatusCodes} from "http-status-codes";
import {realm} from "../utils/realm.js";
import {Meeting, User} from "../models/classes.model.js";
import {UserController} from "./index.js";
import Realm from "realm";

export const inviteUsers = async (req, res) => {
  try {
    const {attendees, _meetingId} = req.body;
    if (_meetingId || attendees) {
      //Check if meeting exists
      let id = new Realm.BSON.ObjectID(_meetingId);
      let meeting = realm.objectForPrimaryKey(Meeting, id);
      if (meeting) {
        for (const email of attendees) {
          const user = await UserController.getUserByEmail(email);
          realm.write(() => {
            if (user != null) {
              const exists = meeting.MeetingAttendees.includes(user);
              if (!exists && (user.email !== meeting.MeetingOwner.email)) {
                meeting.MeetingAttendees.push(user);
              }
            }
          })
        }

        res.status(StatusCodes.OK).json(meeting);
      } else {
        res.status(StatusCodes.BAD_REQUEST).send("Meeting does not exist");
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).send("Invalid Body");
    }

  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }
}