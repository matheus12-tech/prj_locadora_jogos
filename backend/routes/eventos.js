import express from "express";
import { cadastrarEvento, listarEventos } from "../controllers/eventosController.js";
import { verificarLogado, verificarAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rota POST: apenas admin pode cadastrar
router.post("/", verificarLogado, verificarAdmin, cadastrarEvento);

// Rota GET: qualquer usuário pode listar
router.get("/", listarEventos);

export default router;