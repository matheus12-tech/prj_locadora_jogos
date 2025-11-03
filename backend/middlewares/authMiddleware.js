import jwt from "jsonwebtoken";

const SECRET = "sua_chave_secreta";

// Middleware para verificar se o usuário está logado
export function verificarLogado(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  jwt.verify(token, SECRET, (err, usuario) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido." });
    }
    req.usuario = usuario; // popula req.usuario
    next();
  });
}

// Middleware para verificar se o usuário é admin
export function verificarAdmin(req, res, next) {
  if (!req.usuario) {
    return res.status(401).json({ error: "Usuário não autenticado." });
  }

  if (req.usuario.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Acesso negado. Somente administradores." });
  }
}