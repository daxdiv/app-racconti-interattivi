import type { EdgeSchema, NodeSchema } from "./zod";

import fs from "fs";
import sharp from "sharp";

export async function splitImage(
  buffer: Buffer | string,
  firstHalfPath: string,
  secondHalfPath: string
) {
  const { width, height } = await sharp(buffer).metadata();
  const halfWidth = Math.floor(width! / 2);

  await sharp(buffer)
    .extract({ width: halfWidth, height: height!, left: 0, top: 0 })
    .toFile(firstHalfPath);
  await sharp(buffer)
    .extract({ width: halfWidth, height: height!, left: halfWidth, top: 0 })
    .toFile(secondHalfPath);
}

export function writeFiles(userId: string, flowId: string, files: Express.Multer.File[]) {
  files.map(async f => {
    const id = f.originalname.split("_")[0];
    const destPath = `public/${userId}/${flowId}/`;

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    fs.writeFile(`${destPath}/${f.originalname}`, f.buffer, error => {
      if (error) console.error(error);
    });

    if (f.originalname.endsWith("background")) {
      await splitImage(
        f.buffer,
        `${destPath}/${id}_background_left`,
        `${destPath}/${id}_background_right`
      );
    }
  });
}

export function createNodesPayload(
  payload: NodeSchema[],
  basePath: string,
  userId: string,
  flowId: string
) {
  const nodes: NodeSchema[] = [];

  payload.forEach(n => {
    const url = `${basePath.substring(
      0,
      basePath.lastIndexOf("/")
    )}/${userId}/${flowId}/`;

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

export function getSortedNodes(nodes: NodeSchema[], edges: EdgeSchema[]) {
  const incomingEdges: Map<string, number> = new Map(nodes.map(node => [node.id, 0]));
  const adjacencyList: Map<string, string[]> = new Map(nodes.map(node => [node.id, []]));

  edges.forEach(edge => {
    adjacencyList.get(edge.source)?.push(edge.target);
    incomingEdges.set(edge.target, (incomingEdges.get(edge.target) || 0) + 1);
  });

  let sortedNodes: NodeSchema[] = [];
  let queue: NodeSchema[] = [...nodes.filter(node => incomingEdges.get(node.id) === 0)];

  while (queue.length > 0) {
    const node = queue.shift();
    if (node) {
      sortedNodes.push(node);

      adjacencyList.get(node.id)?.forEach(target => {
        incomingEdges.set(target, (incomingEdges.get(target) || 0) - 1);
        if (incomingEdges.get(target) === 0) {
          const targetNode = nodes.find(n => n.id === target);
          if (targetNode) {
            queue.push(targetNode);
          }
        }
      });
    }
  }

  return sortedNodes.map(n => {
    const commonFields: Record<string, unknown> = {
      id: n.id,
      pages: n.pages,
      audio: n.audio,
    };

    switch (n.type) {
      case "base":
        return commonFields;
      case "question":
        return {
          ...commonFields,
          question: n.question,
          values: n.values,
          feedback: n.feedback,
        };
      case "choice":
        return {
          ...commonFields,
          choice: n.choice,
          values: n.values,
          feedback: n.feedback,
          nextSteps: n.nextSteps,
        };
      default:
        return commonFields;
    }
  });
}
