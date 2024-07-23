import { StatusCodes } from "http-status-codes";
import { realm } from "../utils/realm.js";
import { users } from "../models/user.fixtures.js";
import { User } from "../models/classes.model.js";

export const reset = async (req, res) => {
  realm.write(() => {
    // Delete all objects from the realm.
    realm.deleteAll();
    
    // Create some objects here
    users.forEach((user) => {
      let out = realm.create(User, user);
      console.log("Created", out.getName());
    });
  });
  res.status(StatusCodes.OK).json();
}