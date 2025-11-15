import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const BASE_URL = "http://localhost:3000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega usuário do localStorage e valida token
  useEffect(() => {
    const validarToken = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const nome = localStorage.getItem("nome");
      const id = localStorage.getItem("id");

      if (!token || !role || !nome || !id) {
        setLoading(false);
        return;
      }

      try {
        await axios.get(`${BASE_URL}/auth/validar`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ⚡ Garante que id é número
        setUser({ id: Number(id), token, role, nome });
      } catch (err) {
        console.warn("Token inválido ou expirado. Logout...");
        logout();
      } finally {
        setLoading(false);
      }
    };

    validarToken();
  }, []);

  // Login: salva dados no estado e localStorage
  const login = (data) => {
    localStorage.clear();
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("nome", data.nome);
    localStorage.setItem("id", Number(data.id)); // ⚡ id como número
    setUser({ id: Number(data.id), token: data.token, role: data.role, nome: data.nome });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
