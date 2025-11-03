import express from "express";
import { login, cadastrarUsuario } from "../controllers/authController.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET = "sua_chave_secreta"; 

router.post("/login", login);

router.post("/cadastro", cadastrarUsuario);
router.get("/validar", validarToken); 

//serve para validar o token de adm
router.get("/validar", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  jwt.verify(token, SECRET, (err, usuario) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado." });
    }

    res.status(200).json({
      id: usuario.id,
      role: usuario.role,
    });
  });
});

export default router;
