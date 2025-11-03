// routes/usuarios.js
import express from "express";
import {
  listarUsuarios,
  atualizarStatusUsuario,
  aplicarAdvertencia
} from "../controllers/usuariosController.js";

import { verificarLogado, verificarAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Listar todos os usuários → apenas admin
router.get("/", verificarLogado, verificarAdmin, listarUsuarios);

// Banir ou desbanir usuário → apenas admin
router.patch("/:id/status", verificarLogado, verificarAdmin, atualizarStatusUsuario);

// Aplicar advertência → apenas admin
router.patch("/:id/advertencia", verificarLogado, verificarAdmin, aplicarAdvertencia);

export default router;
