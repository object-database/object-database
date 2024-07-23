import cors from "cors";
import bodyParser from "body-parser";
import express from 'express';
require('dotenv').config({ override: true });

const app = express();
const PORT = process.env.PORT | 80;


app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send(JSON.stringify({ message: "API is Up" }));
});


app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server is running, and App is listening on port ${PORT}`);
  } else {
    console.log("Error occurred, server can't start", error);
  }
});


