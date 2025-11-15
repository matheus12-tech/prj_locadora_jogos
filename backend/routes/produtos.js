// backend/routes/produtos.js
import express from "express";
import { cadastrarProduto, listarProdutos } from "../controllers/produtosController.js";
import { verificarLogado, verificarAdmin } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js"; // usa o upload externo
import db from "../db.js";

const router = express.Router();

// Cadastrar produto → precisa estar logado e ser admin
// Usa upload.single("imagem") do middleware externo
router.post("/", verificarLogado, verificarAdmin, upload.single("imagem"), cadastrarProduto);

// Listar produtos → aberto para todos
router.get("/", listarProdutos);

// Buscar produto por ID → aberto para todos
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM tb_produtos WHERE id_produto = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar produto:", err);
    res.status(500).json({ error: "Erro no servidor ao buscar produto" });
  }
});

export default router;
