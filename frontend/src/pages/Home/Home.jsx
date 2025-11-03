import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const BASE_URL = "http://localhost:3000"; // Backend

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [produtos, setProdutos] = useState([]);

  // Buscar produtos do backend
  const buscarProdutos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/produtos`);
      setProdutos(res.data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.logo}>GAMESCOM</div>
          <nav className={styles.nav}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.ativacao}` : styles.link
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/loja"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.ativacao}` : styles.link
              }
            >
              Loja
            </NavLink>
            <NavLink
              to="/eventos"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.ativacao}` : styles.link
              }
            >
              Eventos
            </NavLink>
            <NavLink
              to="/favoritos"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.ativacao}` : styles.link
              }
            >
              Favoritos
            </NavLink>

            {/* Botão de Login */}
            <button className={styles.loginBtn} onClick={() => navigate("/login")}>
              Login
            </button>
          </nav>
        </div>

        <div className={styles.desconto}>
          <p>Faça seu primeiro aluguel com 20%</p>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <input type="text" placeholder="Pesquisar" className={styles.pesquisar} />
          <div className={styles.usuario}>
            <span>{user?.nome || "Usuário"}</span>
            <img
              src="https://via.placeholder.com/30"
              alt="avatar"
              className={styles.avatar}
            />
          </div>
        </header>

        {/* Banner */}
        <section className={styles.banner}>
          <div className={styles.bannerText}>
            <h1>
              Onde os pixels nascem...
              <br /> E você acorda
            </h1>
            <p>Confira nossos produtos mais recentes!</p>
            <button>veja multiuso</button>
          </div>
          <div className={styles.bannerImg}></div>
        </section>

        {/* Produtos */}
        <section className={styles.games}>
          <h2>Produtos Disponíveis</h2>
          <div className={styles.cards}>
            {produtos.length > 0 ? (
              produtos.map((produto) => (
                <div
                  key={produto.id_produto}
                  className={styles.card}
                  onClick={() => navigate(`/produtos/${produto.id_produto}`)}
                >
                  <img
                    src={produto.imagem || "https://via.placeholder.com/250x150"}
                    alt={produto.nome_produto}
                  />
                  <div className={styles.cardInfo}>
                    <p>{produto.nome_produto}</p>
                    <span>${produto.preco}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhum produto disponível.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
