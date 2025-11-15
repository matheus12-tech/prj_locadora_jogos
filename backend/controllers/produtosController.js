import db from "../db.js";
import path from "path";

// ------------------- CADASTRAR PRODUTO -------------------
export async function cadastrarProduto(req, res) {
  const { nome_produto, descricao, preco, estoque, categoria_id } = req.body;

  // Se tiver upload de imagem, o caminho é gerado automaticamente
  const imagem = req.file ? `/uploads/${req.file.filename}` : null;

  // Validação básica
  if (!nome_produto || !preco || !estoque || !categoria_id) {
    return res
      .status(400)
      .json({ error: "Nome, preço, estoque e categoria são obrigatórios." });
  }

  try {
    const [result] = await db.query(
      `
      INSERT INTO tb_produtos 
      (nome_produto, descricao, preco, estoque, imagem, categoria_id) 
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [nome_produto, descricao, preco, estoque, imagem, categoria_id]
    );

    res.status(201).json({
      message: "✅ Produto cadastrado com sucesso!",
      id_produto: result.insertId,
      imagem,
    });
  } catch (err) {
    console.error("❌ Erro ao cadastrar produto:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

// ------------------- LISTAR PRODUTOS -------------------
export async function listarProdutos(req, res) {
  try {
    const [results] = await db.query(`
      SELECT p.*, c.nome_categoria
      FROM tb_produtos p
      LEFT JOIN tb_categorias c ON p.categoria_id = c.id_categoria
      ORDER BY p.nome_produto ASC
    `);

    // Ajusta a URL da imagem pra retornar o caminho completo do servidor
    const produtosComUrl = results.map((p) => ({
      ...p,
      imagem: p.imagem
        ? `http://localhost:3000${p.imagem}`
        : null,
    }));

    res.json(produtosComUrl);
  } catch (err) {
    console.error("❌ Erro ao listar produtos:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}
