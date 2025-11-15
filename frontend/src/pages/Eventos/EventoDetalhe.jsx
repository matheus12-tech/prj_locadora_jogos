import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./EventoDetalhe.module.css";

const BASE_URL = "http://localhost:3000";

export default function EventoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadEvento = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/eventos/${id}`);
      setEvento(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvento();
  }, []);

  if (loading) return <p className={styles.loading}>Carregando evento...</p>;

  if (!evento)
    return <p className={styles.error}>Evento não encontrado.</p>;

  return (
    <div className={styles.container}>
      <button className={styles.voltar} onClick={() => navigate(-1)}>
        ← Voltar
      </button>

      <div className={styles.card}>
        <img
          src={`http://localhost:3000/uploads/${evento.imagem}`}
          alt={evento.nome}
          className={styles.banner}
        />

        <h1 className={styles.title}>{evento.nome}</h1>

        <p className={styles.desc}>{evento.descricao}</p>

        <div className={styles.info}>
          <p><strong>📅 Data:</strong> {new Date(evento.data_evento).toLocaleDateString()}</p>
          <p><strong>📍 Local:</strong> {evento.local}</p>
          <p><strong>🎟 Preço:</strong> R$ {Number(evento.preco).toFixed(2)}</p>
        </div>

        <button className={styles.botao}>
          Participar do Evento
        </button>
      </div>
    </div>
  );
}
