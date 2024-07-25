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
    let meetingsToCreate = getMeetingsToCreate(createdUsers, createdRooms);
    meetingsToCreate.forEach((meeting) => {
      let out = realm.create(Meeting, meeting, "modified");
      console.log("--- Meeting ---\n", out);
    })
  });
  res.status(StatusCodes.OK).json();
}

/**
 * @param {User} users Created users
 * @param {Room} rooms Created rooms

 * @returns {Meeting[]} - Sample meetings
 */
const getMeetingsToCreate = (users, rooms) => {
  let date1 = new Date(2024, 7, 24, 10, 0, 0);
  let date2 = new Date(2024, 7, 24, 11, 0, 0);
  let date3 = new Date(2024, 7, 24, 12, 0, 0);

  let meeting1 = {
    MeetingOwner: users[0],
    MeetingAttendees: [users[1]],
    Title: "Test Meeting 1",
    StartTime: date1,
    EndTime: date2,
    onlineMeeting: {
      teamsLink: "link"
    }
  }
  let meeting2 = {
    MeetingOwner: users[1],
    MeetingAttendees: [users[2], users[3]],
    Title: "Test Meeting 2",
    StartTime: date2,
    EndTime: date3,
    onlineMeeting: {
      teamsLink: "also a link"
    },
    workMeeting: {
      room: rooms[0]
    }
  }
  let meeting3 = {
    MeetingOwner: users[2],
    MeetingAttendees: [users[0], users[1], users[3], users[4], users[5]],
    Title: "Full Test Meeting",
    StartTime: date1,
    EndTime: date3,
    workMeeting: {
      room: rooms[2]
    }
  }

  return [meeting1, meeting2, meeting3];
}