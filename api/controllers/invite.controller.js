import { StatusCodes } from "http-status-codes";
import { realm } from "../utils/realm.js";
import { Meeting, User } from "../models/classes.model.js";
import { UserController } from "./index.js";
import Realm from "realm";

export const inviteUsers = async (req, res) => {
  try {
    const { attendees, _meetingId } = req.body;
    if (_meetingId || attendees) {
      //Check if meeting exists
      //let meeting = realm.objects(Meeting).find((meeting) => meeting._id === _meetingId);
      let id = new Realm.BSON.ObjectID(_meetingId);
      let meeting = realm.objectForPrimaryKey(Meeting, id);
      if (meeting) {
        for (const email of attendees) {
          const user = await UserController.getUserByEmail(email);
          realm.write(() => {
            if (user != null) {
              const exists = meeting.MeetingAttendees.contains(user);
              if (exists) {
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

export const removeUsers = async (req, res) => {
  try {
    const { attendees, _meetingId } = req.body;
    if (_meetingId || attendees) {
      let id = new Realm.BSON.ObjectID(_meetingId);
      let meeting = realm.objectForPrimaryKey(Meeting, id);
      if (meeting) {
        for (const email of attendees) {
          const user = await UserController.getUserByEmail(email);
          realm.write(() => {
            if (user != null) {
              const index = meeting.MeetingAttendees.indexOf(user);
              if (index > -1) {
                meeting.MeetingAttendees.splice(index, 1); // Remove user from attendees
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