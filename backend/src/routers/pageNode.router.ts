import multer, { MulterError } from "multer";

import { MAX_FILE_SIZE } from "../constants";
import PageNodeModel from "../models/PageNode.model";
import express from "express";
import fs from "fs";
import { pageNodeSchema } from "../lib/zod";

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
    const id = parseInt(req.body.id);

    if (isNaN(id) || !Number.isInteger(id) || id < 0) {
      cb(new Error("Invalid id"), "");
      return;
    }

    cb(null, `${id}_${file.fieldname}`);
  },
});
const uploadMedia = multer({
  storage: pageNodeStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).fields([{ name: "backgroundImage" }, { name: "audio" }]);

pageNodeRouter.post("/", (req, res) => {
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
    const { id, ...data } = req.body;
    const schema = pageNodeSchema.safeParse({
      ...data,
      pages: [
        { ...data.pages[0], background: `${baseUrl}/${id}_background` },
        { ...data.pages[1], background: `${baseUrl}/${id}_background` },
      ],
      audio: `${baseUrl}/${id}_audio`,
    });

    if (!schema.success) {
      res.status(400).json({ message: schema.error.issues.join("\n") });
      return;
    }

    const newNode = new PageNodeModel(schema.data);

    try {
      await newNode.save();

      res.status(201).json({ message: "Saved changes" });
    } catch (saveError) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

export default pageNodeRouter;
