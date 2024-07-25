import {StatusCodes} from "http-status-codes";
import {realm} from "../utils/realm.js";
import {User, Meeting} from "../models/classes.model.js";
import Realm from "realm";

export const getUserByEmail = async (email) => {
  return realm.objects(User).find((user) => user.email === email);
}

export const getUser = async (req, res) => {
  let user;
  if (req.query.email) {
    user = realm.objects(User).find((user) => user.email === req.query.email);
  } else if (req.query.id) {
    try {
      let id = new Realm.BSON.ObjectID(req.query.id);
      user = realm.objectForPrimaryKey(User, id);
    } catch {
      res.status(StatusCodes.BAD_REQUEST).json({
        errorMessage: "ID was malformed",
      });
      return;
    }
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      errorMessage: "No valid parameters provided",
    });
    return;
  }

  if (!user) {
    res.status(StatusCodes.BAD_REQUEST).json({
      errorMessage: "This person can't be found",
    });
  } else {
    res.status(StatusCodes.OK).json(user);
  }
};

export const createUser = async (req, res) => {
  if (realm.objects(User).find((user) => user.email === req.body.email)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      errorMessage: "This person already exists",
    });
  } else {
    realm.write(() => {
      let user = realm.create(User, req.body);
      res.status(StatusCodes.CREATED).json(user);
    });
  }
};

export const deleteUser = async (req, res) => {
  let email = req.query.email;
  let user = realm.objects(User).find((user) => user.email === email);
  if (!user) {
    res.status(StatusCodes.BAD_REQUEST).json({
      errorMessage: "This person doesn't exist",
    });
  } else {
    realm.write(() => {
      realm.delete(user);
      res.status(StatusCodes.OK).json();
    });
  }
};

export const getAllUsers = async (req, res) => {
  return res.status(StatusCodes.OK).json(realm.objects(User));
};

export const getUserMeetings = async (req, res) => {
  try {
    const {email} = req.query;
    const user = await getUserByEmail(email);
    if (user) {
      const meetings = realm.objects(Meeting).filter((meeting) => meeting.MeetingAttendees.includes(user));
      res.status(StatusCodes.OK).json(meetings);
    } else {
      res.status(StatusCodes.BAD_REQUEST).json("User does not exist");
    }

  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }
}