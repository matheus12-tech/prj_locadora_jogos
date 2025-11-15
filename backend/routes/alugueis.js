// routes/alugueis.js
import express from "express";
import { criarAluguelEPagamento, listarPagamentosUsuario } from "../controllers/pagamentosController.js";
import { verificarLogado } from "../controllers/authController.js";

const router = express.Router();

// Criar aluguel + pagamento (rota protegida)
router.post("/", verificarLogado, criarAluguelEPagamento);

// Listar pagamentos/aluguéis do usuário logado
router.get("/meus-alugueis", verificarLogado, (req, res) => {
  listarPagamentosUsuario({ params: { usuario_id: req.usuario.id } }, res);
});

export default router;
