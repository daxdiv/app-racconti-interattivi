import { MulterError } from "multer";
import { flowSchema, type EdgeSchema, type NodeSchema } from "../lib/zod";
import express, { type Request } from "express";
import { writeFiles } from "../lib/utils";
import { upload } from "../storages/flow.storage";
import FlowModel from "../models/flow.model";

type MyRequest = Request<
  { [key: string]: string },
  any,
  {
    nodes: NodeSchema[] & { id: string; position: { x: string; y: string } };
    edges: EdgeSchema;
  }
>;

function createNodesPayload(payload: NodeSchema[], basePath: string) {
  const nodes: NodeSchema[] = [];

  payload.forEach(n => {
    const url = `${basePath.substring(0, basePath.lastIndexOf("/"))}/${n.id}`;

    switch (n.type) {
      case "base":
        nodes.push({
          ...n,
          pages: [
            { ...n.pages[0], background: `${url}/${n.id}_background_left` },
            { ...n.pages[1], background: `${url}/${n.id}_background_right` },
          ],
          audio: `${url}/${n.id}_audio`,
        });
        break;
      case "question":
        nodes.push({
          ...n,
          pages: [
            { ...n.pages[0], background: `${url}/${n.id}_background_left` },
            { ...n.pages[1], background: `${url}/${n.id}_background_right` },
          ],
          audio: `${url}/${n.id}_audio`,
          question: {
            ...n.question,
            audio: new Array(3).fill(0).map(() => `${url}/${n.id}_question`),
          },
          feedback: {
            ...n.feedback,
            list: [
              { ...n.feedback.list[0], audio: `${url}/${n.id}_feedback_opt1` },
              { ...n.feedback.list[1], audio: `${url}/${n.id}_feedback_opt2` },
            ],
          },
        });
        break;
      case "choice":
        nodes.push({
          ...n,
          pages: [
            { ...n.pages[0], background: `${url}/${n.id}_background_left` },
            { ...n.pages[1], background: `${url}/${n.id}_background_right` },
          ],
          audio: `${url}/${n.id}_audio`,
          choice: {
            ...n.choice,
            audio: new Array(3).fill(0).map(() => `${url}/${n.id}_choice`),
          },
          feedback: {
            ...n.feedback,
            list: [
              { ...n.feedback.list[0], audio: `${url}/${n.id}_feedback_opt1` },
              { ...n.feedback.list[1], audio: `${url}/${n.id}_feedback_opt2` },
            ],
          },
        });
        break;
    }
  });

  return nodes;
}

const flowRouter = express.Router();

flowRouter.get("/", async (req, res) => {
  try {
    const url = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const baseUrl = `${url.substring(0, url.lastIndexOf("/"))}`;
    const flow = await FlowModel.findOne({});

    if (!flow) {
      res.status(404).json({ message: "Nessun nodo trovare" });
      return;
    }

    res.status(200).json({
      nodes: flow.nodes.map(n => ({
        background: `${baseUrl}/${n.id}/${n.id}_background`,
        ...n.toJSON(),
      })),
      edges: flow.edges,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

flowRouter.post("/", (req: MyRequest, res) => {
  upload(req, res, async err => {
    if (err instanceof MulterError) {
      res.status(400).json({ message: "Bad file(s) provided" });
      return;
    }
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }

    const url = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const files = req.files as Express.Multer.File[];

    writeFiles(files);

    const nodes = createNodesPayload(req.body.nodes, url);
    const edges = req.body.edges || [];
    const schema = flowSchema.safeParse({ nodes, edges });

    if (!schema.success) {
      console.error(schema.error.issues);
      res
        .status(400)
        .json({ message: schema.error.issues.map(i => i.message).join("\n") });
      return;
    }

    try {
      const newFlow = new FlowModel(schema.data);

      await FlowModel.deleteMany({});
      await newFlow.save();

      res.status(200).json({ message: "Racconto salvato" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

export default flowRouter;
