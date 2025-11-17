import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./CadastrarUser.module.css";

const BASE_URL = "http://localhost:3000";

export default function CadastrarUser() {
  const navigate = useNavigate();
  const [userForm, setUserForm] = useState({
    nome: "",
    email: "",
    senha: "",
  });
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/usuarios`, userForm);
      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.error || "Erro ao cadastrar usuário");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Cadastro</h2>
        {erro && <p className={styles.erro}>{erro}</p>}
        <input
          type="text"
          placeholder="Nome"
          value={userForm.nome}
          onChange={(e) => setUserForm({ ...userForm, nome: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={userForm.email}
          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={userForm.senha}
          onChange={(e) => setUserForm({ ...userForm, senha: e.target.value })}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
