import cors from "cors";
import bodyParser from "body-parser";
import express from 'express';
import { router } from "./routes/index.js";
import dotenv from 'dotenv';
dotenv.config({ override: true });
import { auth } from "./auth-middleware.js";
import { corsOptions } from "./cors-middleware.js";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 80;

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 250, // limit each IP to 250 requests per windowMs
});
// Apply the limiter to all requests
app.use(limiter);

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send(JSON.stringify({ message: "API is Up" }));
});

app.use('/api', auth, router);

app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server is running, and App is listening on port ${PORT}`);
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
