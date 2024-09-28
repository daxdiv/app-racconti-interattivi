import { MAX_FILE_SIZE } from "../constants";
import { RequestHandler } from "express";
import fs from "fs";
import multer from "multer";

const pageNodeStorage = multer.diskStorage({
  destination(req, _file, cb) {
    const id = parseInt(req.body.nodeId);

    const destPath = `public/${id}`;

    if (isNaN(id) || !Number.isInteger(id) || id < 0) {
      cb(new Error("Invalid id"), "");
      return;
    }

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    cb(null, destPath);
  },
  filename(req, file, cb) {
    const id = parseInt(req.body.nodeId);

    if (isNaN(id) || !Number.isInteger(id) || id < 0) {
      cb(new Error("Invalid id"), "");
      return;
    }

    cb(null, `${id}_${file.fieldname}`);
  },
});

export function getUploadHandler(nodeType: "base" | "question" | "choice") {
  const uploadsMap: Record<typeof nodeType, RequestHandler> = {
    base: uploadBaseMedia,
    question: uploadQuestionMedia,
    choice: uploadChoiceMedia,
  };

  return uploadsMap[nodeType];
}

const uploadBaseMedia = multer({
  storage: pageNodeStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).fields([{ name: "background" }, { name: "audio" }]);
const uploadQuestionMedia = multer({
  storage: pageNodeStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).fields([
  { name: "background" },
  { name: "audio" },
  { name: "question[audio][0]" },
  { name: "question[audio][1]" },
  { name: "question[audio][2]" },
  { name: "feedback[list][0][audio]" },
  { name: "feedback[list][1][audio]" },
]);
const uploadChoiceMedia = multer({
  storage: pageNodeStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).fields([
  { name: "background" },
  { name: "audio" },
  { name: "choice[audio][0]" },
  { name: "choice[audio][1]" },
  { name: "choice[audio][2]" },
  { name: "feedback[list][0][audio]" },
  { name: "feedback[list][1][audio]" },
]);
