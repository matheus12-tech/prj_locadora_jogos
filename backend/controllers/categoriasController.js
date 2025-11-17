import db from "../db.js";

// 📌 Listar todas as categorias
export async function listarCategorias(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM tb_categorias ORDER BY nome_categoria ASC");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar categorias:", err);
    res.status(500).json({ error: err.message });
  }
}

// 📌 Cadastrar nova categoria
export async function cadastrarCategoria(req, res) {
  try {
    const { nome_categoria } = req.body;

    if (!nome_categoria) {
      return res.status(400).json({ error: "O nome da categoria é obrigatório." });
    }

    const [result] = await db.query(
      "INSERT INTO tb_categorias (nome_categoria) VALUES (?)",
      [nome_categoria]
    );

    res.status(201).json({
      mensagem: "Categoria cadastrada com sucesso!",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Erro ao cadastrar categoria:", err);
    res.status(500).json({ error: err.message });
  }
}
