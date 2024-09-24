import express from "express";
import fs from "fs";
import multer from "multer";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // NOTE: 2MB

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
  filename: (_req, file, cb) => {
    if (file.size > MAX_FILE_SIZE) {
      cb(new Error("File too large"), "");
      return;
    }

    cb(null, file.originalname);
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
}).array("audio[]");

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
      const error404Messages = ["File too large"];

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

uploadRouter.delete("/audio/:id", (req, res) => {
  const id = req.params.id;

  const filePaths = [
    `${id}_question`,
    `${id}_choice`,
    `${id}_question_opt1`,
    `${id}_question_opt2`,
    `${id}_choice_opt1`,
    `${id}_choice_opt2`,
    `${id}_question_feedback_opt1`,
    `${id}_question_feedback_opt2`,
    `${id}_choice_feedback_opt1`,
    `${id}_choice_feedback_opt2`,
  ];

  filePaths.forEach(f => {
    const path = `public/uploads/page/audios/${f}`;

    if (fs.existsSync(path)) {
      fs.unlink(path, err => {
        if (err) console.error(err);
      });
    }
  });

  res.status(200).json({ message: "Files deleted" });
});

export default uploadRouter;
