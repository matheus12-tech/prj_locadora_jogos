import db from "../db.js";

// --------------------------------------
// ADICIONAR ITEM AO CARRINHO
// --------------------------------------
export const adicionarItem = (req, res) => {
  const usuario_id = req.usuario.id;
  const { produto_id, quantidade } = req.body;

  // 1 — Verifica se já existe no carrinho
  const checkSQL = `
    SELECT * FROM tb_carrinho
    WHERE usuario_id = ? AND produto_id = ?
  `;

  db.query(checkSQL, [usuario_id, produto_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Erro no servidor." });

    if (result.length > 0) {
      // Já existe → atualiza quantidade
      const updateSQL = `
        UPDATE tb_carrinho
        SET quantidade = quantidade + ?
        WHERE usuario_id = ? AND produto_id = ?
      `;
      db.query(updateSQL, [quantidade, usuario_id, produto_id], (err2) => {
        if (err2) return res.status(500).json({ error: "Erro ao atualizar item." });

        return res.json({ message: "Quantidade atualizada no carrinho." });
      });

    } else {
      // Não existe → insere
      const insertSQL = `
        INSERT INTO tb_carrinho (usuario_id, produto_id, quantidade)
        VALUES (?, ?, ?)
      `;
      db.query(insertSQL, [usuario_id, produto_id, quantidade], (err3) => {
        if (err3) return res.status(500).json({ error: "Erro ao adicionar ao carrinho." });

        return res.json({ message: "Item adicionado ao carrinho." });
      });
    }
  });
};

// --------------------------------------
// LISTAR CARRINHO DO USUÁRIO
// --------------------------------------
export const listarCarrinho = (req, res) => {
  const usuario_id = req.usuario.id;

  const sql = `
    SELECT c.id_carrinho, c.quantidade,
           p.id_produto, p.nome_produto, p.preco, p.imagem
    FROM tb_carrinho c
    JOIN tb_produtos p ON p.id_produto = c.produto_id
    WHERE c.usuario_id = ?
  `;

  db.query(sql, [usuario_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao listar carrinho." });
    res.json(results);
  });
};

// --------------------------------------
// ATUALIZAR QUANTIDADE
// --------------------------------------
export const atualizarQuantidade = (req, res) => {
  const usuario_id = req.usuario.id;
  const { id } = req.params;
  const { quantidade } = req.body;

  const sql = `
    UPDATE tb_carrinho
    SET quantidade = ?
    WHERE id_carrinho = ? AND usuario_id = ?
  `;

  db.query(sql, [quantidade, id, usuario_id], (err) => {
    if (err) return res.status(500).json({ error: "Erro ao atualizar." });
    res.json({ message: "Quantidade atualizada." });
  });
};

// --------------------------------------
// REMOVER ITEM DO CARRINHO
// --------------------------------------
export const removerItem = (req, res) => {
  const usuario_id = req.usuario.id;
  const { id } = req.params;

  const sql = `
    DELETE FROM tb_carrinho
    WHERE id_carrinho = ? AND usuario_id = ?
  `;

  db.query(sql, [id, usuario_id], (err) => {
    if (err) return res.status(500).json({ error: "Erro ao remover." });
    res.json({ message: "Item removido." });
  });
};

// --------------------------------------
// LIMPAR CARRINHO DO USUÁRIO
// --------------------------------------
export const limparCarrinho = (req, res) => {
  const usuario_id = req.usuario.id;

  const sql = `DELETE FROM tb_carrinho WHERE usuario_id = ?`;

  db.query(sql, [usuario_id], (err) => {
    if (err) return res.status(500).json({ error: "Erro ao limpar." });
    res.json({ message: "Carrinho limpo." });
  });
};
