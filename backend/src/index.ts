import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import flowRouter from "./routers/flow.router";
import mongoose from "mongoose";
import userRouter from "./routers/user.router";

(async () => {
  dotenv.config();

  if (!process.env.CLIENT_URL) {
    throw new Error("Missing CLIENT_URL inside .env");
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL inside .env");
  }
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET inside .env");
  }

  await mongoose.connect(process.env.DATABASE_URL);

  const db = mongoose.connection;

  // NOTE readyState 1 = connected
  if (db.readyState !== 1) return;

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use("/flow", flowRouter);
  app.use("/user", userRouter);

  app
    .listen(PORT, () => {
      console.log(`Server running at PORT: ${PORT}`);
    })
    .on("error", error => {
      throw new Error(error.message);
    });
})();
