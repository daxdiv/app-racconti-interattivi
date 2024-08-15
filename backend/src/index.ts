import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", error => {
    throw new Error(error.message);
  });
