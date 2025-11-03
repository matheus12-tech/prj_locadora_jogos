// controllers/usuariosController.js
import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "seu_seguro_segredo_aqui"; // use .env na prática

// ------------------- LOGIN -------------------
export async function login(req, res) {
  const { email, senha } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM tb_usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const usuario = rows[0];

    // Verifica senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    // Verifica status
    if (usuario.status === "banido") {
      return res.status(403).json({ error: "Usuário banido" });
    }

    // Login ok → gera token
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, role: usuario.role },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        status: usuario.status,
        advertencias: usuario.advertencias
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
}

// ------------------- LISTAR USUÁRIOS -------------------
export async function listarUsuarios(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT id_usuario, nome, email, role, status, advertencias FROM tb_usuarios"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ------------------- BANIR / DESBANIR -------------------
export async function atualizarStatusUsuario(req, res) {
  const { id } = req.params;
  const { status } = req.body; // 'ativo' ou 'banido'

  try {
    await db.query("UPDATE tb_usuarios SET status = ? WHERE id_usuario = ?", [status, id]);
    res.json({ message: `Usuário ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ------------------- APLICAR ADVERTÊNCIA -------------------
export async function aplicarAdvertencia(req, res) {
  const { id } = req.params;

  try {
    await db.query(
      "UPDATE tb_usuarios SET advertencias = advertencias + 1 WHERE id_usuario = ?",
      [id]
    );
    res.json({ message: "Advertência aplicada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
