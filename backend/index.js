import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import produtosRoutes from './routes/produtos.js';
import eventoRoutes from './routes/eventos.js';
import categoriasRoutes from './routes/categoria.js';
import usuariosRoutes from "./routes/usuario.js";
import db from './db.js';

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);         
app.use('/produtos', produtosRoutes); 
app.use('/evento', eventoRoutes);     
app.use('/categoria', categoriasRoutes); // ✅ rota de categorias
app.use("/usuarios", usuariosRoutes);
// Teste raiz
app.get('/', (req, res) => res.send('Servidor funcionando'));

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
