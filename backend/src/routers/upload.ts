import express from "express";
import fs from "fs";
import multer from "multer";

const MAX_FILE_SIZE = 104_857_600; // NOTE: 100MB

const uploadRouter = express.Router();
const backgroundStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const destPath = "public/uploads/page/backgrounds";

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
    const destPath = "public/uploads/page/audios";

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

const choiceBackgroundStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const destPath = "public/uploads/choice/backgrounds";

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
const choiceAudioStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const destPath = `public/uploads/choice/audios`;

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const id = parseInt(req.body.id);
    const of = req.body.of;

    if (file.size > MAX_FILE_SIZE) {
      cb(new Error("File too large"), "");
      return;
    }
    if (isNaN(id) || !Number.isInteger(id) || id < 0) {
      cb(new Error("Invalid id"), "");
      return;
    }

    cb(null, `/${id}_${of}_audio`);
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

const uploadChoiceBackground = multer({
  storage: choiceBackgroundStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).single("background");
const uploadChoiceAudio = multer({
  storage: choiceAudioStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).single("audio");

uploadRouter.post("/background", (req, res) => {
  const nodeType = req.query.nodeType;
  const uploadFn = nodeType === "choice" ? uploadChoiceBackground : uploadBackground;

  uploadFn(req, res, err => {
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
  const nodeType = req.query.nodeType;
  const uploadFn = nodeType === "choice" ? uploadChoiceAudio : uploadAudio;

  uploadFn(req, res, err => {
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
