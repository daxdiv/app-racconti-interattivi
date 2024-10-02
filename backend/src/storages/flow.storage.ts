import { MAX_FILE_SIZE } from "../constants";
import multer from "multer";

const flowStorage = multer.memoryStorage();
export const upload = multer({
  storage: flowStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).any();
