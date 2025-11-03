import express from "express";
import { listarCategorias } from "../controllers/categoriasController.js";

const router = express.Router();

// Rota GET /categoria → retorna todas as categorias
router.get("/", listarCategorias);

export default router;