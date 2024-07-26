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
    let warning;
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
            warning = `Room is too full, capacity of ${room.Capacity}, but ${meetingAttendees.length + 1} people are attending (including the owner)`;
          }
        }

        // Extract hours from the start and end times
        const startHour = new Date(startTime).getHours();
        const endHour = new Date(endTime).getHours();
        const startTimeObj = new Date(startTime);
        const endTimeObj = new Date(endTime);

        // Check for continuous timeslot availability based on hours
        let currentHour = startHour;
        let isTimeSlotAvailable = true;

        // Check for timeslots that match the 'currentHour'
        while (currentHour < endHour && isTimeSlotAvailable) {
          isTimeSlotAvailable = room.TimeSlots.some(slot => {
            const slotStartHour = new Date(slot.StartTime).getHours();
            const slotEndHour = new Date(slot.EndTime).getHours();
            return slotStartHour <= currentHour && slotEndHour > currentHour;
          });
          currentHour++;
        }
        if (room && !isTimeSlotAvailable) {
          throw new Error('The room is not available at the requested time');
        }
        
        const roomMeetings = realm.objects(Meeting).filtered('workMeeting.room._id == $0', room._id);
        const hasConflict = room && roomMeetings.some(meeting => {
          const meetingStartTime = new Date(meeting.StartTime);
          const meetingEndTime = new Date(meeting.EndTime);
          // Ensure the meeting does not overlap with any existing meetings
          return (meetingStartTime < endTimeObj && meetingEndTime > startTimeObj) && meeting.workMeeting !== undefined;
        });
        if (room && hasConflict) {
          throw new Error('The room is already booked for the requested time');
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

    res.status(StatusCodes.CREATED).json({
      ...newMeeting,
      warning: warning
    });
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
