// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import DashboardAdmin from "./pages/DashboardAdmin/DashboardAdmin";
import Eventos from "./pages/Eventos/Eventos";
import Loja from "./pages/Loja/Loja";
import CadastrarProduto from "./pages/DashboardAdmin/Produtos/CadastrarProduto";
import CadastrarEvento from "./pages/DashboardAdmin/Eventos/CadastrarEvento";
import ProdutoDetalhe from "./pages/Produtos/ProdutoDetalhe";
import Login from "./pages/Auth/Login";
import Usuarios from "./pages/DashboardAdmin/Usuarios/Usuarios";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Carrinho from "./pages/Carrinho/Carrinho";
import Pagamento from "./pages/Pagamento/Pagamento";
import Confirmacao from "./pages/Confirmacao/Confirmacao";
import MeusAlugueis from "./pages/MeusAlugueis/MeusAlugueis";
import EventoDetalhe from "./pages/Eventos/EventoDetalhe";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 🔸 Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* 🔸 Rotas para usuários logados */}
          <Route
            path="/eventos"
            element={
              <ProtectedRoute>
                <Eventos />
              </ProtectedRoute>
            }
          />

          {/* 🔥 NOVA ROTA — Detalhe do Evento */}
          <Route
            path="/eventos/:id"
            element={
              <ProtectedRoute>
                <EventoDetalhe />
              </ProtectedRoute>
            }
          />

          <Route
            path="/loja"
            element={
              <ProtectedRoute>
                <Loja />
              </ProtectedRoute>
            }
          />

          <Route
            path="/produtos/:id"
            element={
              <ProtectedRoute>
                <ProdutoDetalhe />
              </ProtectedRoute>
            }
          />

          {/* 🔹 Sistema de aluguel e pagamento */}
          <Route
            path="/carrinho"
            element={
              <ProtectedRoute>
                <Carrinho />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pagamentos"
            element={
              <ProtectedRoute>
                <Pagamento />
              </ProtectedRoute>
            }
          />

          <Route
            path="/confirmacao"
            element={
              <ProtectedRoute>
                <Confirmacao />
              </ProtectedRoute>
            }
          />

          <Route
            path="/meus-alugueis"
            element={
              <ProtectedRoute>
                <MeusAlugueis />
              </ProtectedRoute>
            }
          />

          {/* 🔸 Rotas apenas para admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute admin={true}>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cadastrar-evento"
            element={
              <ProtectedRoute admin={true}>
                <CadastrarEvento />
              </ProtectedRoute>
            }
          />

          <Route
            path="/usuarios"
            element={
              <ProtectedRoute admin={true}>
                <Usuarios />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cadastro-produto"
            element={
              <ProtectedRoute admin={true}>
                <CadastrarProduto />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
