import express from "express";
import fs from "fs";
import multer from "multer";

const MAX_FILE_SIZE = 104_857_600; // NOTE: 100MB

const uploadRouter = express.Router();
const backgroundStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const destPath = "public/uploads/backgrounds";

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const id = parseInt(req.body.id);

    if (file.size > MAX_FILE_SIZE) {
      cb(new Error("File too large"), "");
      return;
    }
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
  filename: (req, file, cb) => {
    const id = parseInt(req.body.id);

    if (file.size > MAX_FILE_SIZE) {
      cb(new Error("File too large"), "");
      return;
    }
    if (isNaN(id) || !Number.isInteger(id) || id < 0) {
      cb(new Error("Invalid id"), "");
      return;
    }

    cb(null, `${id}_audio`);
  },
});
const uploadBackground = multer({
  storage: backgroundStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).single("background");
const uploadAudio = multer({
  storage: audioStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).single("audio");

uploadRouter.post("/background", (req, res) => {
  uploadBackground(req, res, err => {
    if (err) {
      const error404Messages = ["Invalid id", "File too large"];

      if (error404Messages.includes(err.message)) {
        res.status(400).json({ message: err.message });
        return;
      }

      res.status(500).json({ message: "Internal server error" });
      return;
    }

    res.status(201).json({ message: "Background uploaded" });
  });
});

uploadRouter.post("/audio", (req, res) => {
  uploadAudio(req, res, err => {
    if (err) {
      const error404Messages = ["Invalid id", "File too large"];

      if (error404Messages.includes(err.message)) {
        res.status(400).json({ message: err.message });
        return;
      }

      res.status(500).json({ message: "Internal server error" });
      return;
    }

    res.status(201).json({ message: "Audio uploaded" });
  });
});

export default uploadRouter;
