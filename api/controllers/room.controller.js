import {StatusCodes} from "http-status-codes";
import {realm} from "../utils/realm.js";
import {Room} from "../models/classes.model.js";
import Realm from "realm";
import { TimeSlot } from "../models/classes.model.js";

export const getAllRooms = async (req, res) => {
  try {
    let allRooms = realm.objects(Room);
    res.status(StatusCodes.OK).json(allRooms);
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: "Failed to fetch rooms",
    });
  }
};

export const createRoom = async (req, res) => {
  const {location, name, capacity, timeSlots} = req.body;

  try {
    let newRoom;
    realm.write(() => {
      newRoom = realm.create("Room", {
        _id: new Realm.BSON.ObjectId(),
        Location: location,
        Name: name,
        Capacity: capacity,
        TimeSlots: timeSlots.map(slot => ({
          _id: new Realm.BSON.ObjectId(),
          StartTime: new Date(slot.startTime),
          EndTime: new Date(slot.endTime),
        })),
      });
    });

    res.status(StatusCodes.CREATED).json(newRoom);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: "Failed to create room",
      error: error.message,
    });
  }
};

export const deleteRoom = async (req, res) => {
  const {roomId} = req.params;

  try {
    realm.write(() => {
      const roomToDelete = realm.objectForPrimaryKey("Room", new Realm.BSON.ObjectId(roomId));
      if (roomToDelete) {
        realm.delete(roomToDelete);
        res.status(StatusCodes.OK).json({message: "Room deleted successfully"});
      } else {
        res.status(StatusCodes.NOT_FOUND).json({errorMessage: "Room not found"});
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: "Failed to delete room",
      error: error.message,
    });
  }
};

export const getRoomById = async (req, res) => {
  const {roomId} = req.params;

  try {
    const room = realm.objectForPrimaryKey("Room", new Realm.BSON.ObjectId(roomId));
    if (room) {
      res.status(StatusCodes.OK).json(room);
    } else {
      res.status(StatusCodes.NOT_FOUND).json({errorMessage: "Room not found"});
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: "Failed to fetch room",
      error: error.message,
    });
  }
};

export const getTimeSlotsByRoomId = async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = realm.objectForPrimaryKey("Room", new Realm.BSON.ObjectId(roomId));
    if (room) {
      const TimeSlot = realm.objects("TimeSlot").filtered("roomId == $0", new Realm.BSON.ObjectId(roomId));
      const TimeSlotsArray = Array.from(TimeSlot);
      res.status(StatusCodes.OK).json(TimeSlotsArray);
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ errorMessage: "Room not found" });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: "Failed to fetch TimeSlots",
      error: error.message,
    });
  }
};