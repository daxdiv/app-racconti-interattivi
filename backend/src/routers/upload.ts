import express from "express";
import fs from "fs";
import multer from "multer";

const uploadRouter = express.Router();
const backgroundStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const destPath = "public/uploads/backgrounds";

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    cb(null, destPath);
  },
  filename: (req, _file, cb) => {
    const id = parseInt(req.body.id);

    if (isNaN(id) || !Number.isInteger(id) || id < 0) {
      cb(new Error("Invalid id"), "");
      return;
    }

    cb(null, `/${id}_background`);
  },
});
const audioStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const destPath = "public/uploads/audios";

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    cb(null, destPath);
  },
  filename: (req, _file, cb) => {
    const id = parseInt(req.body.id);

    if (isNaN(id) || !Number.isInteger(id) || id < 0) {
      cb(new Error("Invalid id"), "");
    }

    cb(null, `${id}_audio`);
  },
});
const uploadBackground = multer({ storage: backgroundStorage }).single("background");
const uploadAudio = multer({ storage: audioStorage }).single("audio");

uploadRouter.post("/background", (req, res) => {
  uploadBackground(req, res, err => {
    if (err) {
      if (err.message === "Invalid id") {
        res.sendStatus(400);
        return;
      }

      res.sendStatus(500);
      return;
    }

    res.sendStatus(201);
  });
});

uploadRouter.post("/audio", (req, res) => {
  uploadAudio(req, res, err => {
    if (err) {
      if (err.message === "Invalid id") {
        res.sendStatus(400);
        return;
      }

      res.sendStatus(500);
      return;
    }

    res.sendStatus(201);
  });
});

export default uploadRouter;
