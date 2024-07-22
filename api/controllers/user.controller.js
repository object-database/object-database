import {StatusCodes} from "http-status-codes";


export const getAllUsers = async (req, res) => {
  return res.status(StatusCodes.OK).json({message: "Get all users"});
}