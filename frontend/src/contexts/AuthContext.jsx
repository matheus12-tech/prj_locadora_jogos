import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const BASE_URL = "http://localhost:3000"; // ajuste se seu backend estiver em outra porta

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // evita piscar de tela

  useEffect(() => {
    const validarToken = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const nome = localStorage.getItem("nome");

      if (!token || !role || !nome) {
        setLoading(false);
        return;
      }

      try {
        // 🔍 verifica no backend se o token ainda é válido
        await axios.get(`${BASE_URL}/auth/validar`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // se o token for válido, mantém o usuário logado
        setUser({ token, role, nome });
      } catch (err) {
        console.warn("Token expirado ou inválido. Fazendo logout...");
        logout();
      } finally {
        setLoading(false);
      }
    };

    validarToken();
  }, []);

  const login = (data) => {
    localStorage.clear();
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("nome", data.nome);
    setUser(data);
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
