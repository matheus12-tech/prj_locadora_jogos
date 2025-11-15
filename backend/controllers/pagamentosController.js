import db from "../db.js";

// Criar aluguel + pagamento
export const criarAluguelEPagamento = async (req, res) => {
  const { produto_id, usuario_id, dias, metodo, valor, numero_cartao, nome_titular, validade_cartao, cvv } = req.body;

  // Valida dados obrigatórios
  if (!produto_id || !usuario_id || !dias || !metodo || valor == null) {
    return res.status(400).json({ error: "Dados do aluguel ou pagamento incompletos" });
  }

  // Se for cartão, valida campos obrigatórios
  if (metodo === "cartao") {
    if (!numero_cartao || !nome_titular || !validade_cartao || !cvv) {
      return res.status(400).json({ error: "Dados do cartão incompletos" });
    }
  }

  try {
    // 1️⃣ Criar aluguel
    const data_aluguel = new Date();
    const data_devolucao = new Date();
    data_devolucao.setDate(data_aluguel.getDate() + Number(dias));

    const aluguelValor = Number(valor);

    const [aluguel] = await db.query(
      `INSERT INTO tb_alugueis (usuario_id, produto_id, data_aluguel, data_devolucao, status, valor)
       VALUES (?, ?, ?, ?, 'pendente', ?)`,
      [usuario_id, produto_id, data_aluguel, data_devolucao, aluguelValor]
    );

    const aluguel_id = aluguel.insertId;

    // 2️⃣ Criar pagamento
    const [pagamento] = await db.query(
      `INSERT INTO tb_pagamentos 
       (aluguel_id, metodo, valor, status, numero_cartao, nome_titular, validade_cartao, cvv)
       VALUES (?, ?, ?, 'pendente', ?, ?, ?, ?)`,
      [
        aluguel_id,
        metodo,
        aluguelValor,
        metodo === "cartao" ? numero_cartao : null,
        metodo === "cartao" ? nome_titular : null,
        metodo === "cartao" ? validade_cartao : null,
        metodo === "cartao" ? cvv : null,
      ]
    );

    res.status(201).json({ aluguel_id, id_pagamento: pagamento.insertId, status: 'pendente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar aluguel e pagamento" });
  }
};

// Listar pagamentos de um usuário
export const listarPagamentosUsuario = async (req, res) => {
  const usuario_id = req.params.usuario_id;

  try {
    const [rows] = await db.query(
      `SELECT p.*, a.id_aluguel, a.produto_id, pr.nome_produto
       FROM tb_pagamentos p
       JOIN tb_alugueis a ON p.aluguel_id = a.id_aluguel
       JOIN tb_produtos pr ON a.produto_id = pr.id_produto
       WHERE a.usuario_id = ?`,
      [usuario_id]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar pagamentos" });
  }
};

// Atualizar status do pagamento
export const atualizarStatusPagamento = async (req, res) => {
  const { id_pagamento } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status é obrigatório" });
  }

  try {
    await db.query(`UPDATE tb_pagamentos SET status = ? WHERE id_pagamento = ?`, [status, id_pagamento]);

    // Opcional: se status for aprovado, atualizar aluguel para ativo
    if (status === "aprovado") {
      await db.query(
        `UPDATE tb_alugueis a
         JOIN tb_pagamentos p ON a.id_aluguel = p.aluguel_id
         SET a.status = 'ativo'
         WHERE p.id_pagamento = ?`,
        [id_pagamento]
      );
    }

    res.status(200).json({ id_pagamento, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar pagamento" });
  }
};
