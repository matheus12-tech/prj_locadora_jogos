import db from "../db.js";

// 📌 Listar todos os eventos
export async function listarEventos(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM tb_eventos ORDER BY data_inicio ASC");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar eventos:", err);
    res.status(500).json({ error: err.message });
  }
}

// 📌 Cadastrar evento (apenas admin)
export async function cadastrarEvento(req, res) {
  try {
    const { titulo, descricao, data_inicio, data_fim, local } = req.body;

    if (!titulo || !data_inicio || !local) {
      return res.status(400).json({ error: "Campos obrigatórios não preenchidos." });
    }

    const [result] = await db.query(
      `INSERT INTO tb_eventos (titulo, descricao, data_inicio, data_fim, local)
       VALUES (?, ?, ?, ?, ?)`,
      [titulo, descricao, data_inicio, data_fim, local]
    );

    res.status(201).json({
      mensagem: "Evento cadastrado com sucesso!",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Erro ao cadastrar evento:", err);
    res.status(500).json({ error: err.message });
  }
}

// 📌 Buscar evento por ID (Rota nova)
export async function buscarEventoPorId(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM tb_eventos WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar evento por ID:", err);
    res.status(500).json({ error: err.message });
  }
}
