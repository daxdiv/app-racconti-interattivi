import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173" })); // TODO: set frontend URL inside .env
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app
  .listen(PORT, () => {
    console.log(`Server running at PORT: ${PORT}`);
  })
  .on("error", error => {
    throw new Error(error.message);
  });
