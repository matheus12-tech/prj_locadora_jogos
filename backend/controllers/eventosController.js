import db from "../db.js";

// LISTAR TODOS OS EVENTOS
export async function listarEventos(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM tb_eventos");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar eventos:", err);
    res.status(500).json({ error: err.message });
  }
}

// CADASTRAR EVENTO (ADMIN)
export async function cadastrarEvento(req, res) {
  try {
    const { titulo, descricao, data_inicio, data_fim, local } = req.body;

    const sql = `
      INSERT INTO tb_eventos 
      (titulo, descricao, data_inicio, data_fim, local)
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      titulo,
      descricao,
      data_inicio,
      data_fim,
      local
    ]);

    res.status(201).json({ message: "Evento cadastrado com sucesso" });
  } catch (err) {
    console.error("Erro ao cadastrar evento:", err);
    res.status(500).json({ error: err.message });
  }
}

// BUSCAR EVENTO POR ID
export async function buscarEventoPorId(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM tb_eventos WHERE id_evento = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error("Erro ao buscar evento por ID:", err);
    res.status(500).json({ error: err.message });
  }
}
