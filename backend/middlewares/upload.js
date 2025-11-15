import multer from "multer";
import path from "path";
import fs from "fs";

// Garante que a pasta uploads existe
const pastaUploads = path.resolve("uploads");
if (!fs.existsSync(pastaUploads)) {
  fs.mkdirSync(pastaUploads);
}

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pastaUploads);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nomeArquivo = Date.now() + ext;
    cb(null, nomeArquivo);
  },
});

export const upload = multer({ storage });
