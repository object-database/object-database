import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (req, res) => {
  res.status(200).send(JSON.stringify({ message: "API is Up" }));
});