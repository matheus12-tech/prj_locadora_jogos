import React, { useState, useEffect } from "react";
import styles from "./Eventos.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const BASE_URL = "http://localhost:3000"; // removido /api

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const { user } = useAuth(); // pega o usuário logado
  const navigate = useNavigate();

  // Buscar eventos do backend
  const buscarEventos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/evento`); // GET /evento
      setEventos(res.data);
    } catch (err) {
      console.error("Erro ao buscar eventos:", err);
    }
  };

  useEffect(() => {
    buscarEventos();
  }, []);

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>GAMESCOM</div>
        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.ativo : "")}>
            Home
          </NavLink>
          <NavLink to="/loja" className={({ isActive }) => (isActive ? styles.ativo : "")}>
            Loja
          </NavLink>
          <NavLink to="/eventos" className={({ isActive }) => (isActive ? styles.ativo : "")}>
            Eventos
          </NavLink>
          <NavLink to="/favoritos" className={({ isActive }) => (isActive ? styles.ativo : "")}>
            Favoritos
          </NavLink>
        </nav>
      </aside>

      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <input type="text" placeholder="Pesquisar eventos..." className={styles.pesquisar} />
          <div className={styles.usuario}>
            <span>{user?.nome || "Usuário"}</span>
            <img src="https://via.placeholder.com/35" alt="avatar" className={styles.avatar} />
          </div>
        </header>

        {/* Banner */}
        <section className={styles.banner}>
          <div className={styles.bannerContent}>
            <h1>Próximos Eventos</h1>
            <p>Confira os eventos imperdíveis do mês!</p>

            {/* Botão só aparece para admin */}
            {user?.role === "admin" && (
              <button onClick={() => navigate("/cadastrar-evento")}>
                Cadastrar Novo Evento
              </button>
            )}
          </div>
          <img src="https://via.placeholder.com/500x250" alt="banner" />
        </section>

        {/* Lista de Eventos */}
        <section className={styles.eventos}>
          <h2>Eventos Cadastrados</h2>
          <div className={styles.cards}>
            {eventos.length > 0 ? (
              eventos.map((ev) => (
                <div key={ev.id} className={styles.card}>
                  <div className={styles.cardInfo}>
                    <h3>{ev.titulo}</h3>
                    <p>{ev.descricao || "Sem descrição"}</p>
                    <p>
                      {ev.data_inicio} {ev.data_fim ? `- ${ev.data_fim}` : ""}
                    </p>
                    <p>Local: {ev.local || "Não informado"}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhum evento cadastrado.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
