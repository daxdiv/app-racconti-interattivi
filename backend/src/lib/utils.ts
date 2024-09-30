import sharp from "sharp";

export async function splitImage(
  path: string,
  firstHalfPath: string,
  secondHalfPath: string
) {
  const { width, height } = await sharp(path).metadata();
  const halfWidth = Math.floor(width! / 2);
  await sharp(path)
    .extract({ width: halfWidth, height: height!, left: 0, top: 0 })
    .toFile(firstHalfPath);
  await sharp(path)
    .extract({ width: halfWidth, height: height!, left: halfWidth, top: 0 })
    .toFile(secondHalfPath);
}
