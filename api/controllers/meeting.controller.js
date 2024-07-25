import {StatusCodes} from "http-status-codes";
import {realm} from "../utils/realm.js";
import {
  Meeting,
  Room,
  User,
  onlineMeeting,
  workMeeting,
} from "../models/classes.model.js";
import Realm from "realm";

export const createMeeting = async (req, res) => {
  const {
    title,
    startTime,
    endTime,
    roomId,
    teamsLink,
    attendees,
    meetingOwner
  } = req.body;

  try {
    let newMeeting;
    realm.write(() => {
      const meetingOwnerUser = realm.objects(User).find((user) => user.email === meetingOwner);
      const meetingAttendees = attendees.map((attendee) =>
        realm.objects(User).find((user) => user.email === attendee)
      );

      if (attendees.includes(meetingOwner)) {
        throw new Error("Owner cannot also be an attendee");
      }
      if (meetingAttendees.includes(undefined)) {
        throw new Error("One or more of the attendees cannot be located");
      }

      if (roomId || teamsLink) {
        let room = realm.objectForPrimaryKey(
          Room,
          new Realm.BSON.ObjectId(roomId)
        );
        if (roomId && !room) {
          throw new Error("Room ID doesn't exist");
        }
        if (room && room.Capacity < meetingAttendees.length + 1) {
          if (!teamsLink) {
            throw new Error(`Room is too full, capacity of ${room.Capacity}, but ${meetingAttendees.length + 1} people are attending (including the owner)`);
          }
        }
        
        let meetingToCreate = {
          _id: new Realm.BSON.ObjectId(),
          MeetingOwner: meetingOwnerUser,
          MeetingAttendees: meetingAttendees,
          Title: title,
          StartTime: new Date(startTime),
          EndTime: new Date(endTime),
        }
        if (teamsLink) {
          meetingToCreate.onlineMeeting = {teamsLink};
        }
        if (roomId) {
          meetingToCreate.workMeeting = {room};
        }

        newMeeting = realm.create("Meeting", meetingToCreate);
      } else {
        throw new Error('We need a roomId or a teamsLink');
      }
    });

    res.status(StatusCodes.CREATED).json(newMeeting);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: "Failed to create meeting",
      error: error.message,
    });
  }
};

export const getMeetingById = async (req, res) => {
  const {meetingId} = req.params;

  try {
    const meeting = realm.objectForPrimaryKey("Meeting", new Realm.BSON.ObjectId(meetingId));
    if (meeting) {
      res.status(StatusCodes.OK).json(meeting);
    } else {
      res.status(StatusCodes.NOT_FOUND).json({errorMessage: "Meeting not found"});
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: "Failed to fetch meeting",
      error: error.message,
    });
  }
};

export const getAllMeetings = async (req, res) => {
  try {
    const allMeetings = realm.objects("Meeting");
    res.status(StatusCodes.OK).json(allMeetings);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: "Failed to fetch meetings",
      error: error.message,
    });
  }
};

export const deleteMeeting = async (req, res) => {
  const {meetingId} = req.params;

  try {
    realm.write(() => {
      const meetingToDelete = realm.objectForPrimaryKey("Meeting", new Realm.BSON.ObjectId(meetingId));
      if (meetingToDelete) {
        realm.delete(meetingToDelete);
        res.status(StatusCodes.OK).json({message: "Meeting deleted successfully"});
      } else {
        res.status(StatusCodes.NOT_FOUND).json({errorMessage: "Meeting not found"});
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: "Failed to delete meeting",
      error: error.message,
    });
  }
};
