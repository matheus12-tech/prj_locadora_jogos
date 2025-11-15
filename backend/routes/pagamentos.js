import express from "express";
import {
  criarAluguelEPagamento,
  listarPagamentosUsuario,
  atualizarStatusPagamento,
} from "../controllers/aluguelPagamentoController.js";
import { verificarLogado } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Criar aluguel + pagamento
router.post("/", verificarLogado, criarAluguelEPagamento);

// Listar pagamentos do usuário
router.get("/usuario/:usuario_id", verificarLogado, listarPagamentosUsuario);

// Atualizar status do pagamento
router.patch("/:id_pagamento", verificarLogado, atualizarStatusPagamento);

export default router;
