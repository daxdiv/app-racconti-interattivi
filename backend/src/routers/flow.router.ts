import { MulterError } from "multer";
import {
  postFlowSchema,
  putFlowSchema,
  deleteFlowSchema,
  type EdgeSchema,
  type NodeSchema,
} from "../lib/zod";
import express, { type Request } from "express";
import { createNodesPayload, getSortedNodes, writeFiles } from "../lib/utils";
import { upload } from "../storages/flow.storage";
import FlowModel from "../models/flow.model";
import { auth } from "../middlewares";
import mongoose from "mongoose";
import fs from "fs";

type PutRequest = Request<
  { flowId: string },
  any,
  {
    nodes: NodeSchema[] & { id: string; position: { x: string; y: string } };
    edges: EdgeSchema[];
  }
>;

const flowRouter = express.Router();

flowRouter.get("/:flowId", auth, async (req, res) => {
  const { verified } = res.locals;
  const { flowId } = req.params;

  try {
    const url = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const baseUrl = `${url.substring(0, url.lastIndexOf("/"))}`;
    const flow = await FlowModel.findOne({ userId: verified._id, _id: flowId });

    if (!flow) {
      res.status(404).json({ message: "Racconto non trovato per questo utente" });
      return;
    }

    res.status(200).json({
      label: flow.label,
      nodes: flow.nodes.map(n => ({
        background: `${baseUrl}/${verified._id}/${flowId}/${n.id}/${n.id}_background`,
        ...n.toJSON(),
      })),
      edges: flow.edges,
    });
  } catch (error) {
    res.status(500).json({ message: "Errore lato server" });
  }
});
flowRouter.get("/:flowId/download", auth, async (req, res) => {
  const { verified } = res.locals;
  const { flowId } = req.params;

  try {
    const flow = await FlowModel.findOne({ userId: verified._id, _id: flowId });

    if (!flow) {
      res.status(404).json({ message: "Racconto non trovato per questo utente" });
      return;
    }

    const sortedNodes = getSortedNodes(flow.nodes.toObject(), flow.edges.toObject());

    res.setHeader("Content-Disposition", 'attachment; filename="flow.json"');
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(sortedNodes, null, 2));
  } catch (error) {
    res.status(500).json({ message: "Errore lato server" });
  }
});

flowRouter.post("/", auth, (req, res) => {
  upload(req, res, async err => {
    if (err instanceof MulterError) {
      res.status(400).json({ message: "File forniti non nel formato corretto" });
      return;
    }
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }

    const { verified } = res.locals;
    const url = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const files = req.files as Express.Multer.File[];
    const flowId = new mongoose.Types.ObjectId().toString();

    writeFiles(verified._id, flowId, files);

    const nodes = createNodesPayload(req.body.nodes, url, verified._id, flowId);
    const edges = req.body.edges || [];
    const schema = postFlowSchema.safeParse({
      userId: verified._id,
      label: req.body.label,
      nodes,
      edges,
    });

    if (!schema.success) {
      res
        .status(400)
        .json({ message: schema.error.issues.map(i => i.message).join("\n") });
      return;
    }

    try {
      const newFlow = new FlowModel({
        _id: flowId,
        userId: verified._id,
        label: schema.data.label,
        nodes: schema.data.nodes,
        edges: schema.data.edges,
      });

      await newFlow.save();

      res.status(200).json({ message: "Racconto creato" });
    } catch (error) {
      if (error.code === 11000) {
        res
          .status(409)
          .json({ message: "Esiste già un racconto creato da te con questo nome" });
        return;
      }
      res.status(500).json({ message: "Errore lato server" });
    }
  });
});

flowRouter.put("/:flowId", auth, (req: PutRequest, res) => {
  upload(req, res, async err => {
    if (err instanceof MulterError) {
      res.status(400).json({ message: "File forniti non nel formato corretto" });
      return;
    }
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }

    const { verified } = res.locals;

    try {
      const flowExists = await FlowModel.findById(req.params.flowId, {
        userId: verified._id,
      });

      if (!flowExists) {
        res.status(404).json({ message: "Nessun racconto trovato" });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: error });
      return;
    }

    const url = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const files = req.files as Express.Multer.File[];
    const flowId = req.params.flowId;

    writeFiles(verified._id, flowId, files);

    const nodes = createNodesPayload(req.body.nodes, url, verified._id, flowId);

    const edges = req.body.edges || [];
    const schema = putFlowSchema.safeParse({
      userId: verified._id,
      nodes: nodes.map(n => {
        if (n.type === "choice") {
          n.nextSteps = edges.filter(e => e.source === n.id).map(e => e.id);

          return n;
        }
        if (!edges.some(e => e.source === n.id)) {
          return {
            ...n,
            lastPage: true,
            evaluation: {
              show: true,
              label: "Quanto ti è piaciuta la storia?",
            },
          };
        }

        return n;
      }),
      edges,
    });

    if (!schema.success) {
      console.dir(schema.error.issues, { depth: Infinity });
      res
        .status(400)
        .json({ message: schema.error.issues.map(i => i.message).join("\n") });
      return;
    }

    try {
      const flow = await FlowModel.findOneAndUpdate(
        { userId: verified._id, _id: flowId },
        {
          $set: {
            nodes: schema.data.nodes,
            edges: schema.data.edges,
          },
        }
      );

      if (!flow) {
        res.status(404).json({ message: "Nessun racconto trovato" });
        return;
      }

      res.status(200).json({ message: "Modifiche al racconto salvate" });
    } catch (error) {
      res.status(500).json({ message: "Errore lato server" });
    }
  });
});

flowRouter.delete("/:flowId", auth, async (req: Request<{ flowId: string }>, res) => {
  const { verified } = res.locals;
  const schema = deleteFlowSchema.safeParse(req.params);

  if (!schema.success) {
    res.status(400).json({ message: schema.error.issues.map(i => i.message).join("\n") });
    return;
  }

  try {
    await FlowModel.findOneAndDelete({ _id: schema.data.flowId, userId: verified._id });

    fs.rmSync(`public/${verified._id}/${schema.data.flowId}`, {
      recursive: true,
      force: true,
    });
    res.status(200).json({ message: "Racconto eliminato" });
  } catch (error) {
    res.status(500).json({ message: "Errore lato server" });
  }
});

export default flowRouter;
