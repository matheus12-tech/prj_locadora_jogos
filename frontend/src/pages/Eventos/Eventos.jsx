import React, { useState, useEffect } from "react";
import styles from "./Eventos.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const BASE_URL = "http://localhost:3000";

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const buscarEventos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/evento`);
      setEventos(res.data);
    } catch (err) {
      console.error("Erro ao buscar eventos:", err);
    }
  };

  useEffect(() => {
    buscarEventos();
  }, []);

  // Função automática para pegar o ID correto
  const pegarId = (ev) => {
    return (
      ev.id ||
      ev.id_evento ||
      ev.idEventos ||
      ev.Id ||
      ev._id ||
      ev.ID ||
      undefined
    );
  };

  return (
    <div className={styles.container}>
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
        <header className={styles.header}>
          <input type="text" placeholder="Pesquisar eventos..." className={styles.pesquisar} />
          <div className={styles.usuario}>
            <span>{user?.nome || "Usuário"}</span>
            <img src="https://via.placeholder.com/35" alt="avatar" className={styles.avatar} />
          </div>
        </header>

        <section className={styles.banner}>
          <div className={styles.bannerContent}>
            <h1>Próximos Eventos</h1>
            <p>Confira os eventos imperdíveis do mês!</p>

            {user?.role === "admin" && (
              <button onClick={() => navigate("/cadastrar-evento")}>
                Cadastrar Novo Evento
              </button>
            )}
          </div>
          <img src="https://via.placeholder.com/500x250" alt="banner" />
        </section>

        <section className={styles.eventos}>
          <h2>Eventos Cadastrados</h2>
          <div className={styles.cards}>
            {eventos.length > 0 ? (
              eventos.map((ev) => {
                console.log("EVENTO RECEBIDO:", ev);

                const id = pegarId(ev);

                return (
                  <div
                    key={id}
                    className={styles.card}
                    onClick={() => {
                      if (!id) {
                        alert("Este evento não possui ID!");
                        return;
                      }
                      navigate(`/eventos/${id}`);
                    }}
                  >
                    <div className={styles.cardInfo}>
                      <h3>{ev.titulo}</h3>
                      <p>{ev.descricao || "Sem descrição"}</p>
                      <p>
                        {ev.data_inicio} {ev.data_fim ? `- ${ev.data_fim}` : ""}
                      </p>
                      <p>Local: {ev.local || "Não informado"}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Nenhum evento cadastrado.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
