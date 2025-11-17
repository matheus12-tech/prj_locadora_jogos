import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "seu_seguro_segredo_aqui"; // ⚠️ ideal colocar no .env

// ------------------- LOGIN -------------------
export async function login(req, res) {
  const { email, senha } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM tb_login WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const usuario = rows[0];

    // Comparação de senha (bcrypt)
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    if (usuario.status === "banido") {
      return res.status(403).json({ error: "Usuário banido" });
    }

    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        status: usuario.status,
      },
    });
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    res.status(500).json({ error: "Erro no servidor" });
  }
}

// ------------------- LISTAR USUÁRIOS -------------------
export async function listarUsuarios(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT 
         u.id, 
         u.nome, 
         u.email, 
         u.role, 
         u.status,
         COUNT(a.id_advertencia) AS advertencias
       FROM tb_login u
       LEFT JOIN tb_advertencias a ON u.id = a.id_usuario
       WHERE u.role != 'admin'
       GROUP BY u.id, u.nome, u.email, u.role, u.status`
    );

    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar usuários:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

// ------------------- ATUALIZAR STATUS (banir/desbanir) -------------------
export async function atualizarStatusUsuario(req, res) {
  const { id } = req.params;
  const { status } = req.body; // "ativo" ou "banido"

  try {
    const [result] = await db.query(
      "UPDATE tb_login SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({ message: `Usuário atualizado para status: ${status}` });
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

// ------------------- APLICAR ADVERTÊNCIA -------------------
export async function aplicarAdvertencia(req, res) {
  const { id } = req.params; // id do usuário que recebe advertência
  const idAplicador = req.usuario?.id; // vem do token JWT
  const motivo = "Advertência aplicada pelo administrador"; // pode virar input futuramente

  try {
    await db.query(
      `INSERT INTO tb_advertencias (id_usuario, id_aplicador, motivo)
       VALUES (?, ?, ?)`,
      [id, idAplicador, motivo]
    );

    res.json({ message: "Advertência aplicada com sucesso" });
  } catch (err) {
    console.error("Erro ao aplicar advertência:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}
