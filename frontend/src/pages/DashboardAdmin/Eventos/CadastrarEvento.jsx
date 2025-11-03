import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./CadastrarEvento.module.css";

const BASE_URL = "http://localhost:3000";

export default function CadastrarEvento() {
  const navigate = useNavigate();
  const [eventoForm, setEventoForm] = useState({
    titulo: "",
    descricao: "",
    data_inicio: "",
    data_fim: "",
    local: ""
  });

  // Pega o token do localStorage (assumindo que você salvou após login)
  const token = localStorage.getItem("token");

  const cadastrarEvento = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Você precisa estar logado para cadastrar eventos.");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/evento`,
        eventoForm,
        {
          headers: {
            Authorization: `Bearer ${token}` // envia o JWT
          }
        }
      );

      alert("Evento cadastrado com sucesso!");
      navigate("/eventos"); // redireciona para a lista de eventos

    } catch (err) {
      console.error(err);
      alert("Erro: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className={styles.container}>
      <h1>Cadastro de Evento</h1>
      <form className={styles.form} onSubmit={cadastrarEvento}>
        <input
          type="text"
          placeholder="Título do evento"
          value={eventoForm.titulo}
          onChange={(e) => setEventoForm({ ...eventoForm, titulo: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Descrição"
          value={eventoForm.descricao}
          onChange={(e) => setEventoForm({ ...eventoForm, descricao: e.target.value })}
        />
        <input
          type="date"
          value={eventoForm.data_inicio}
          onChange={(e) => setEventoForm({ ...eventoForm, data_inicio: e.target.value })}
          required
        />
        <input
          type="date"
          value={eventoForm.data_fim}
          onChange={(e) => setEventoForm({ ...eventoForm, data_fim: e.target.value })}
        />
        <input
          type="text"
          placeholder="Local"
          value={eventoForm.local}
          onChange={(e) => setEventoForm({ ...eventoForm, local: e.target.value })}
        />
        <button type="submit" className={styles.botao}>
          Cadastrar Evento
        </button>
      </form>
    </div>
  );
}
