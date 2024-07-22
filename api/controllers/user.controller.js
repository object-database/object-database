import {HttpStatusCodes} from "../utils/index.js";


export const getAllUsers = async (req, res) => {
  return res.status(HttpStatusCodes.OK).json({message: "Get all users"});
}