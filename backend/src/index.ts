import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import uploadRouter from "./routers/upload";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/upload", uploadRouter);

app
  .listen(PORT, () => {
    console.log(`Server running at PORT: ${PORT}`);
  })
  .on("error", error => {
    throw new Error(error.message);
  });
