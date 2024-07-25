import { StatusCodes } from "http-status-codes";
import { realm } from "../utils/realm.js";
import { User } from "../models/classes.model.js";
import Realm from "realm";

export const getUserByEmail = async (email) => {
  return realm.objects(User).find((user) => user.email === email);
}

export const getUser = async (req, res) => {
  try {
    let email = req.query.email;
    if (email) {
      let user = realm.objects(User).find((user) => user.email === email);
      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json({
          errorMessage: "This person can't be found",
        });
      } else {
        res.status(StatusCodes.OK).json(user);
      }
    }
    else {
      res.status(StatusCodes.BAD_REQUEST).send("Invalid Body");
    }
  }
  catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message)
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (email || name) {
      if (realm.objects(User).find((user) => user.email === email)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          errorMessage: "This person already exists",
        });
      } else {
        realm.write(() => {
          let user = realm.create(User, {
            _id: new Realm.BSON.ObjectId(),
            email: email,
            name: name
          });
          res.status(StatusCodes.CREATED).json(user);
        });
      }
    }
    else {
      res.status(StatusCodes.BAD_REQUEST).send("Invalid Body");
    }
  }
  catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message)
  }
};

export const deleteUser = async (req, res) => {
  try {
    let email = req.query.email;
    if (email) {
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
    }
    else {
      res.status(StatusCodes.BAD_REQUEST).send("Invalid Body");
    }
  }
  catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message)
  }
};

export const getAllUsers = async (req, res) => {
  return res.status(StatusCodes.OK).json(realm.objects(User));
};
