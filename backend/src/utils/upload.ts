import { MAX_FILE_SIZE } from "../constants";
import multer from "multer";
import pageNodeStorage from "../storages/pageNode.storage";

export const uploadBaseMedia = multer({
  storage: pageNodeStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).fields([{ name: "backgroundImage" }, { name: "audio" }]);
export const uploadQuestionMedia = multer({
  storage: pageNodeStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).fields([
  { name: "backgroundImage" },
  { name: "audio" },
  { name: "question[audio][0]" },
  { name: "question[audio][1]" },
  { name: "question[audio][2]" },
  { name: "feedback[list][0][audio]" },
  { name: "feedback[list][1][audio]" },
]);
export const uploadChoiceMedia = multer({
  storage: pageNodeStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).fields([
  { name: "backgroundImage" },
  { name: "audio" },
  { name: "choice[audio][0]" },
  { name: "choice[audio][1]" },
  { name: "choice[audio][2]" },
  { name: "feedback[list][0][audio]" },
  { name: "feedback[list][1][audio]" },
]);
