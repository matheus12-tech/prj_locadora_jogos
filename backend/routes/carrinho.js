import express from "express";
import {
  adicionarItem,
  listarCarrinho,
  atualizarQuantidade,
  removerItem,
  limparCarrinho
} from "../controllers/carrinhoController.js";

import { verificarLogado } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verificarLogado, adicionarItem);
router.get("/", verificarLogado, listarCarrinho);
router.put("/:id", verificarLogado, atualizarQuantidade);
router.delete("/:id", verificarLogado, removerItem);
router.delete("/usuario/limpar", verificarLogado, limparCarrinho);

export default router;
