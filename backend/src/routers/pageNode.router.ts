import { MulterError } from "multer";

import PageNodeModel from "../models/PageNode.model";
import express, { type Request } from "express";
import { PageNodeSchema, pageNodeSchema } from "../lib/zod";
import { getUploadHandler } from "../storages/pageNode.storage";
import path from "path";
import { splitImage } from "../utils/misc";

type MyRequest = Request<
  { nodeId: string },
  any,
  PageNodeSchema,
  { nodeType: PageNodeSchema["type"] }
>;

const pageNodeRouter = express.Router();

pageNodeRouter.get("/:nodeId", async (req: MyRequest, res) => {
  const { nodeId } = req.params;

  try {
    const pageNode = await PageNodeModel.findOne({ nodeId });

    if (!pageNode) {
      res.status(404).json({ message: "Not found" });
      return;
    }

    const url = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const baseUrl = `${url.substring(0, url.lastIndexOf("/"))}/${nodeId}`;

    res.status(200).json({
      ...pageNode.toJSON(),
      background: `${baseUrl}/${nodeId}_background`,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

pageNodeRouter.post("/", (req: MyRequest, res) => {
  const acceptedNodeTypes = ["base", "question", "choice"];

  if (!acceptedNodeTypes.includes(req.query.nodeType)) {
    res
      .status(400)
      .json({ message: `Accepted node types: "base", "question" or "choice"` });
    return;
  }

  const upload = getUploadHandler(req.query.nodeType);

  upload(req, res, async err => {
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

    const url = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const baseUrl = `${url.substring(0, url.lastIndexOf("/"))}/${req.body.nodeId}`;
    const publicUrl = `public/${req.body.nodeId}/${req.body.nodeId}`;
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };
    const backgroundUrl = `${publicUrl}_background`;

    await splitImage(
      backgroundUrl,
      `${publicUrl}_background_left`,
      `${publicUrl}_background_right`
    );

    switch (req.body.type) {
      case "question":
        req.body.question = {
          ...req.body.question,
          audio: new Array(3)
            .fill(0)
            .map((_, i) => `${baseUrl}/${req.body.nodeId}_question[audio][${i}]`),
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
          audio: new Array(3)
            .fill(0)
            .map((_, i) => `${baseUrl}/${req.body.nodeId}_choice[audio][${i}]`),
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
      pages: new Array(2).fill(0).map((_, i) => {
        const side = i === 0 ? "_left" : "_right";

        return {
          ...req.body.pages[i],
          background: `${baseUrl}/${req.body.nodeId}_background${side}${path.extname(
            files["background"][0].originalname
          )}`,
        };
      }),
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
      const existingNode = await PageNodeModel.findOne({ nodeId: schema.data.nodeId });

      if (existingNode) {
        // FIXME i have a "question" node, i change to a "choice node" so i need to unset the field(s)
        // present in "question" nodes but not into "choice" nodes (field question in schema)
        // but the $unset inside PageNodeModel.updateOne(...) doesn't work
        // i'll leave like this for now
        await PageNodeModel.deleteOne({ _id: existingNode._id });
        await newNode.save();
      } else {
        await newNode.save();
      }

      res.status(201).json({ message: "Saved changes" });
      return;
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ message: "Duplicate label" });
        return;
      }

      res.status(500).json({ message: "Internal server error" });
    }
  });
});

export default pageNodeRouter;
