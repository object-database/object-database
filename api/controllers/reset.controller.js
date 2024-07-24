import { StatusCodes } from "http-status-codes";
import { realm } from "../utils/realm.js";
import { users } from "../models/user.fixtures.js";
import { rooms } from "../models/room.fixtures.js";
import { Meeting, Room, User } from "../models/classes.model.js";

export const reset = async (req, res) => {
  realm.write(() => {
    // Delete all objects from the realm.
    // realm.deleteAll();
    
    // Create some objects here
    let createdUsers = [];
    users.forEach((user) => {
      let out = realm.create(User, user, "modified");
      console.log("Created", out.getName());
      createdUsers.push(out);
    });
    let createdRooms = [];
    rooms.forEach((room) => {
      let out = realm.create(Room, room, "modified");
      console.log("Created", out.getName());
      createdRooms.push(out);
    });

    // Create meetings - a little bit more complicated.
    let startDate = new Date(2024, 7, 24, 10, 0, 0);
    let endDate = new Date(2024, 7, 24, 11, 0, 0);
    console.log(startDate);
    let meeting = {
      MeetingOwner: createdUsers[0],
      MeetingAttendees: [createdUsers[1]],
      Title: "Test Meeting",
      StartTime: startDate,
      EndTime: endDate,
      onlineMeeting: {
        teamsLink: "link"
      }
    }
    let out = realm.create(Meeting, meeting, "modified");
    console.log(out);
  });
  res.status(StatusCodes.OK).json();
}