import fs from "fs";
import multer from "multer";

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

export default pageNodeStorage;
