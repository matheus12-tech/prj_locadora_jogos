import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // pasta onde as imagens vão ficar
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // exemplo: 17304901231.jpg
  },
});

export const upload = multer({ storage });