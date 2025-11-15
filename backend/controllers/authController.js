import db from "../db.js";
import jwt from "jsonwebtoken";

const SECRET = "secretkey"; // troque para variável de ambiente em produção

// ============================================================
// 🧩 LOGIN (admin ou usuário comum)
// ============================================================
export async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const [rows] = await db.execute(
      "SELECT * FROM usuario_login WHERE TRIM(LOWER(email)) = LOWER(?) AND TRIM(senha) = ?",
      [email.trim(), senha.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Informações de login incorretas." });
    }

    const usuario = rows[0];

    // Cria o token JWT com id e role
    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      SECRET,
      { expiresIn: "8h" }
    );

    // ⚡ Retorna id junto com token, nome e role
    res.status(200).json({
      id: usuario.id,
      nome: usuario.nome,
      role: usuario.role,
      token,
    });
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

// ============================================================
// 📝 CADASTRAR USUÁRIO (padrão = 'usuario')
// ============================================================
export async function cadastrarUsuario(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    const [existing] = await db.execute(
      "SELECT * FROM usuario_login WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Email já cadastrado!" });
    }

    await db.execute(
      "INSERT INTO usuario_login (nome, email, senha, role) VALUES (?, ?, ?, ?)",
      [nome, email, senha, "usuario"]
    );

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    console.error("Erro ao cadastrar usuário:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

// ============================================================
// 🔐 MIDDLEWARE DE AUTENTICAÇÃO
// ============================================================

// Verifica se o usuário está logado
export function verificarLogado(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token não fornecido." });

  jwt.verify(token, SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ error: "Token inválido." });
    req.usuario = usuario;
    next();
  });
}

// Verifica se o usuário é administrador
export function verificarAdmin(req, res, next) {
  if (req.usuario.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Acesso negado. Somente administradores." });
  }
}

// ============================================================
// 🔐 VALIDAÇÃO DE TOKEN
// ============================================================
export async function validarToken(req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token ausente" });

  try {
    const decoded = jwt.verify(token, SECRET);
    return res.status(200).json({
      valid: true,
      id: decoded.id,
      role: decoded.role,
    });
  } catch {
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
}
