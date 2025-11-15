import db from "../db.js";

// Criar um novo aluguel
export const criarAluguel = async (req, res) => {
  try {
    const { usuario_id, produto_id, valor } = req.body;

    // 0 é válido, mas valor null/undefined não
    if (!usuario_id || !produto_id || valor == null) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const [result] = await db.query(
      "INSERT INTO tb_alugueis (usuario_id, produto_id, valor, status) VALUES (?, ?, ?, 'pendente')",
      [usuario_id, produto_id, valor]
    );

    res.status(201).json({ message: "Aluguel criado com sucesso", id: result.insertId });
  } catch (err) {
    console.error("Erro ao criar aluguel:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Listar todos os aluguéis de um usuário
export const listarAlugueisUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const [rows] = await db.query(
      `SELECT a.*, p.nome_produto, p.imagem 
       FROM tb_alugueis a
       JOIN tb_produtos p ON a.produto_id = p.id_produto
       WHERE a.usuario_id = ?`,
      [usuario_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar aluguéis:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
