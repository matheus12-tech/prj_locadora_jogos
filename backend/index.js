import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import produtosRoutes from './routes/produtos.js';
import eventoRoutes from './routes/eventos.js';
import categoriasRoutes from './routes/categoria.js';
import usuariosRoutes from './routes/usuario.js';
import alugueisRoutes from "./routes/alugueis.js";
import pagamentosRoutes from "./routes/pagamentos.js";
import carrinhoRoutes from "./routes/carrinho.js";

const app = express();
const PORT = 3000;

// Necessário para usar __dirname com ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors({
  origin: "http://localhost:5173", // ajuste para a porta do seu frontend
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rotas
app.use('/auth', authRoutes);          
app.use('/produtos', produtosRoutes);  
app.use('/eventos', eventoRoutes);      
app.use('/categoria', categoriasRoutes); 
app.use('/usuarios', usuariosRoutes); 
app.use("/alugueis", alugueisRoutes);      // já deve ter middleware verificarLogado nas rotas
app.use("/pagamentos", pagamentosRoutes);  // idem
app.use("/carrinho", carrinhoRoutes);

// Teste raiz
app.get('/', (req, res) => res.send('Servidor funcionando ✅'));

// Middleware de erro genérico
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
);
