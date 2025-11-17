import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { loginUser } from "../../services/loginService";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, senha);
      login(data);
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/eventos");
      }
    } catch (err) {
      setErro(err.message || "Erro ao fazer login");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Login</h2>
        {erro && <p className={styles.erro}>{erro}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
        <p className={styles.textoCadastro}>
          Não tem conta?{" "}
          <NavLink to="/cadastrar" className={styles.linkCadastro}>
            Cadastre-se
          </NavLink>
        </p>
      </form>
    </div>
  );
}
