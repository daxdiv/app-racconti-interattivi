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

export function writeFiles(files: Express.Multer.File[]) {
  files.map(async f => {
    const id = f.originalname.split("_")[0];
    const destPath = `public/${id}`;

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
