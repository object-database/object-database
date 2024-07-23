import { StatusCodes } from "http-status-codes";
import { realm } from "../utils/realm.js";
import { User } from "../models/classes.model.js";

export const getAllUsers = async (req, res) => {
  return res.status(StatusCodes.OK).json(realm.objects(User));
};

export const createUser = async (req, res) => {
  if (realm.objects(User).find((user) => user.email === req.body.email)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      errorMessage: "This person already exists",
    });
  } else {
    realm.write(() => {
      let user = realm.create(User, req.body);
      res.status(StatusCodes.OK).json(user);
    });
  }
};
