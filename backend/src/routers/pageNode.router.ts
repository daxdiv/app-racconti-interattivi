import multer, { MulterError } from "multer";

import { MAX_FILE_SIZE } from "../constants";
import PageNodeModel from "../models/PageNode.model";
import express, { type Request } from "express";
import fs from "fs";
import { PageNodeSchema, pageNodeSchema } from "../lib/zod";

type MyRequest = Request<any, any, PageNodeSchema, { nodeType: PageNodeSchema["type"] }>;

const pageNodeRouter = express.Router();
const pageNodeStorage = multer.diskStorage({
  destination(_req, _file, cb) {
    const destPath = "public/";

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    cb(null, destPath);
  },
  async filename(req, file, cb) {
    const id = parseInt(req.body.nodeId);

    if (isNaN(id) || !Number.isInteger(id) || id < 0) {
      cb(new Error("Invalid id"), "");
      return;
    }

    cb(null, `${id}_${file.fieldname}`);
  },
});

const uploadBaseMedia = multer({
  storage: pageNodeStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).fields([{ name: "backgroundImage" }, { name: "audio" }]);
const uploadQuestionMedia = multer({
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
const uploadChoiceMedia = multer({
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

pageNodeRouter.post("/", (req: MyRequest, res) => {
  let uploadMedia;

  switch (req.query.nodeType) {
    case "base":
      uploadMedia = uploadBaseMedia;
      break;
    case "question":
      uploadMedia = uploadQuestionMedia;
      break;
    case "choice":
      uploadMedia = uploadChoiceMedia;
      break;
    default:
      res
        .status(400)
        .json({ message: `Accepted node types: "base", "question" or "choice"` });
      return;
  }

  uploadMedia(req, res, async err => {
    if (err) {
      if (err.message === "Invalid id") {
        res.status(400).json({ message: err.message });
        return;
      }
      if (err instanceof MulterError) {
        res.status(400).json({ message: "Bad file(s) provided" });
        return;
      }

      res.status(500).json({ message: "Internal server error" });
      return;
    }

    const fullUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const baseUrl = fullUrl.substring(0, fullUrl.lastIndexOf("/"));

    switch (req.body.type) {
      case "question":
        req.body.question = {
          ...req.body.question,
          audio: [
            `${baseUrl}/${req.body.nodeId}_question[audio][0]`,
            `${baseUrl}/${req.body.nodeId}_question[audio][1]`,
            `${baseUrl}/${req.body.nodeId}_question[audio][2]`,
          ],
        };
        req.body.feedback = {
          ...req.body.feedback,
          list: [
            {
              ...req.body.feedback.list[0],
              audio: `${baseUrl}/${req.body.nodeId}_feedback[list][0][audio]`,
            },
            {
              ...req.body.feedback.list[1],
              audio: `${baseUrl}/${req.body.nodeId}_feedback[list][1][audio]`,
            },
          ],
        };
        break;
      case "choice":
        req.body.choice = {
          ...req.body.choice,
          audio: [
            `${baseUrl}/${req.body.nodeId}_choice[audio][0]`,
            `${baseUrl}/${req.body.nodeId}_choice[audio][1]`,
            `${baseUrl}/${req.body.nodeId}_choice[audio][2]`,
          ],
        };
        req.body.feedback = {
          ...req.body.feedback,
          list: [
            {
              ...req.body.feedback.list[0],
              audio: `${baseUrl}/${req.body.nodeId}_feedback[list][0][audio]`,
            },
            {
              ...req.body.feedback.list[1],
              audio: `${baseUrl}/${req.body.nodeId}_feedback[list][1][audio]`,
            },
          ],
        };
        break;
    }

    const schema = pageNodeSchema.safeParse({
      ...req.body,
      pages: [
        { ...req.body.pages[0], background: `${baseUrl}/${req.body.nodeId}_background` },
        { ...req.body.pages[1], background: `${baseUrl}/${req.body.nodeId}_background` },
      ],
      audio: `${baseUrl}/${req.body.nodeId}_audio`,
    });

    if (!schema.success) {
      res
        .status(400)
        .json({ message: schema.error.issues.map(i => i.message).join("\n") });
      return;
    }

    const newNode = new PageNodeModel(schema.data);

    try {
      const nodeExists = await PageNodeModel.findOne({ nodeId: schema.data.nodeId });

      if (nodeExists) {
        await PageNodeModel.updateOne({ nodeId: schema.data.nodeId }, schema.data);
      } else {
        await newNode.save();
      }

      res.status(201).json({ message: "Saved changes" });
    } catch (saveError) {
      if (saveError.code === 11000) {
        res.status(400).json({ message: "Duplicate label" });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

export default pageNodeRouter;
