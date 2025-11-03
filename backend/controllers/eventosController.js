import db from '../db.js';

// Cadastrar evento (somente admin)
export async function cadastrarEvento(req, res) {
  try {
    // Verifica se o usuário está no req (middleware garante isso)
    if (!req.usuario) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const { titulo, descricao, data_inicio, data_fim, local } = req.body;

    // Campos obrigatórios
    if (!titulo || !data_inicio) {
      return res.status(400).json({ error: 'Título e data de início são obrigatórios' });
    }

    // Insere no banco
    const [result] = await db.query(
      'INSERT INTO tb_eventos (titulo, descricao, data_inicio, data_fim, local) VALUES (?, ?, ?, ?, ?)',
      [titulo, descricao, data_inicio, data_fim, local]
    );

    res.status(201).json({ message: 'Evento cadastrado com sucesso!', id: result.insertId });

  } catch (err) {
    console.error(err); // log para debug
    res.status(500).json({ error: 'Erro ao cadastrar evento: ' + err.message });
  }
}

// Listar eventos (qualquer usuário)
export async function listarEventos(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM tb_eventos ORDER BY data_inicio ASC');
    res.json(rows);
  } catch (err) {
    console.error(err); // log para debug
    res.status(500).json({ error: 'Erro ao listar eventos: ' + err.message });
  }
}
