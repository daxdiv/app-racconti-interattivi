import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import pageNodeRouter from "./routers/pageNode.router";

(async () => {
  dotenv.config();

  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL inside .env");
  }

  await mongoose.connect(process.env.DATABASE_URL);

  const db = mongoose.connection;

  // NOTE readyState 1 = connected
  if (db.readyState !== 1) return;

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors({ origin: process.env.CLIENT_URL }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use("/node", pageNodeRouter);

  app
    .listen(PORT, () => {
      console.log(`Server running at PORT: ${PORT}`);
    })
    .on("error", error => {
      throw new Error(error.message);
    });
})();
