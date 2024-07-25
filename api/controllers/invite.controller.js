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
      //let meeting = realm.objects(Meeting).find((meeting) => meeting._id === _meetingId);
      realm.write(() => {
        let id = new Realm.BSON.ObjectID(_meetingId);
        let meeting = realm.objectForPrimaryKey(Meeting, id);
        if (meeting) {
          attendees.forEach(async email => {
            const user = await UserController.getUserByEmail(email);
            if (user != null) {
              meeting.MeetingAttendees.push(meeting);
            }
          })
        } else {
          res.status(StatusCodes.BAD_REQUEST).send("Meeting does not exist");
        }

      })
    } else {
      res.status(StatusCodes.BAD_REQUEST).send("Invalid Body");
    }

  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }
}