import {StatusCodes} from "http-status-codes";
import {realm} from "../utils/realm.js";
import {
  Meeting,
  Room,
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
  } = req.body;

  try {
    let newMeeting;
    realm.write(() => {
      const meetingOwner = realm.objects(Meeting).find((user) => user.email === req.query.email);
      const meetingAttendees = meetingAttendeesIds.map((attendee) =>
        realm.objects(Meeting).find((user) => user.email === attendee)
      );

      if (roomId || teamsLink) {
        newMeeting = realm.create("Meeting", {
          _id: new Realm.BSON.ObjectId(),
          MeetingOwner: meetingOwner,
          MeetingAttendees: meetingAttendees,
          Title: title,
          StartTime: new Date(startTime),
          EndTime: new Date(endTime),
          onlineMeeting: {
            teamsLink,
          },
          workMeeting: {
            room: realm.objectForPrimaryKey(
              "Room",
              new Realm.BSON.ObjectId(roomId)
            ),
          },
        });
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
