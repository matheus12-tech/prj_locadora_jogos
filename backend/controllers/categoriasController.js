import db from "../db.js";

// Função para listar categorias
export async function listarCategorias(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM tb_categorias");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar categorias:", err);
    res.status(500).json({ error: err.message });
  }
}
