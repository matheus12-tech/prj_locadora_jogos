import express from "express";
import { cadastrarEvento, listarEventos, buscarEventoPorId } from "../controllers/eventosController.js";
import { verificarLogado, verificarAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST — Cadastrar evento (apenas admin)
router.post("/", verificarLogado, verificarAdmin, cadastrarEvento);

// GET — Listar todos os eventos
router.get("/", listarEventos);

// 🔥 GET — Buscar evento por ID (Rota nova que faltava)
router.get("/:id", buscarEventoPorId);

export default router;
