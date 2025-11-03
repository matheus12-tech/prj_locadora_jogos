import db from '../db.js'; 
import jwt from 'jsonwebtoken'; // vamos usar JWT para autenticação
const SECRET = 'sua_chave_secreta'; // coloque uma chave forte em produção



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

export function verificarAdmin(req, res, next) {
  if (req.usuario.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Acesso negado. Somente administradores." });
  }
};

export async function validarToken(req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const SECRET = "sua_chave_secreta";

  if (!token) return res.status(401).json({ error: "Token ausente" });

  try {
    const decoded = jwt.verify(token, SECRET);
    return res.status(200).json({ valid: true, role: decoded.role });
  } catch {
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
}
// Login unificado
export async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT * FROM usuario_login WHERE TRIM(LOWER(email)) = LOWER(?) AND TRIM(senha) = ?',
      [email.trim(), senha.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Informações de login incorretas.' });
    }

    const usuario = rows[0];

    // Cria um token JWT com id e role do usuário
    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
      role: usuario.role,
      nome: usuario.nome
    });

  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}

// Cadastro de usuário (sempre role = 'usuario')
export async function cadastrarUsuario(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const [existing] = await db.execute(
      'SELECT * FROM usuario_login WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email já cadastrado!' });
    }

    await db.execute(
      'INSERT INTO usuario_login (nome, email, senha, role) VALUES (?, ?, ?, ?)',
      [nome, email, senha, 'usuario']
    );

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });

  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}