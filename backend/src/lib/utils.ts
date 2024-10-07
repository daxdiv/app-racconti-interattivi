import type { NodeSchema } from "./zod";
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
    const destPath = `public/${userId}/${flowId}/${id}`;

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    fs.writeFile(`${destPath}/${f.originalname}`, f.buffer, error => {
      if (error) console.error(error);
    });

    if (f.originalname.endsWith("background"))
      await splitImage(
        f.buffer,
        `${destPath}/${id}_background_left`,
        `${destPath}/${id}_background_right`
      );
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
    )}/${userId}/${flowId}/${n.id}`;

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
