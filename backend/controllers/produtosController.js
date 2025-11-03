import db from '../db.js';

// Cadastrar produto → apenas admin (rotas verificam isso)
export async function cadastrarProduto(req, res) {
  const { nome_produto, descricao, preco, estoque, imagem, categoria_id } = req.body;

  // Validação básica
  if (!nome_produto || !preco || !estoque || !categoria_id) {
    return res.status(400).json({ error: 'Nome, preço, estoque e categoria são obrigatórios' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO tb_produtos 
      (nome_produto, descricao, preco, estoque, imagem, categoria_id) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [nome_produto, descricao, preco, estoque, imagem, categoria_id]
    );

    res.status(201).json({ message: 'Produto cadastrado com sucesso!', id_produto: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Listar produtos → aberto para todos, inclui o nome da categoria
export async function listarProdutos(req, res) {
  try {
    const [results] = await db.query(`
      SELECT p.*, c.nome_categoria
      FROM tb_produtos p
      LEFT JOIN tb_categorias c ON p.categoria_id = c.id_categoria
      ORDER BY p.nome_produto ASC
    `);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
