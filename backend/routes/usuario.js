import express from "express";
import {
  listarUsuarios,
  atualizarStatusUsuario,
  aplicarAdvertencia,
} from "../controllers/usuariosController.js";

import { verificarLogado, verificarAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verificarLogado, verificarAdmin, listarUsuarios);
router.patch("/:id/status", verificarLogado, verificarAdmin, atualizarStatusUsuario);
router.post("/:id/advertencia", verificarLogado, verificarAdmin, aplicarAdvertencia);

export default router;
