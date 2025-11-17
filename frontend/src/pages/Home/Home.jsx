import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { FiLogOut } from "react-icons/fi"; // Ícone de porta para logout

const BASE_URL = "http://localhost:3000";

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [produtos, setProdutos] = useState([]);

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

  const getImagemUrl = (imagem) => {
    if (!imagem) return "https://placehold.co/300x180?text=Sem+Imagem";
    if (imagem.startsWith("http")) return imagem;
    return `${BASE_URL}${imagem.startsWith("/") ? imagem : `/${imagem}`}`;
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.logo}>GAMESCOM</div>
          <nav className={styles.nav}>
            <NavLink to="/" className={({ isActive }) => (isActive ? styles.ativo : "")}>Home</NavLink>
            <NavLink to="/loja" className={({ isActive }) => (isActive ? styles.ativo : "")}>Loja</NavLink>
            <NavLink to="/eventos" className={({ isActive }) => (isActive ? styles.ativo : "")}>Eventos</NavLink>
            <NavLink to="/favoritos" className={({ isActive }) => (isActive ? styles.ativo : "")}>Favoritos</NavLink>

            {!user && (
              <button
                className={styles.loginBtn}
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            )}

            {user && (
              <button className={styles.logoutBtn} onClick={logout}>
                <FiLogOut size={18} style={{ marginRight: "5px" }} /> Logout
              </button>
            )}
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <input
            type="text"
            placeholder="Pesquisar"
            className={styles.pesquisar}
          />
          <div className={styles.usuario}>
            <span>{user?.nome || "Visitante"}</span>
            <img
              src="https://via.placeholder.com/35"
              alt="avatar"
              className={styles.avatar}
            />
          </div>
        </header>

        {/* Hero Banner */}
        <section className={styles.banner}>
          <div className={styles.bannerText}>
            <h1>Onde os pixels ganham vida <br /> e você desperta!</h1>
            <p>Explore consoles, jogos e acessórios incríveis. Bem-vindo à sua loja gamer!</p>
            <button onClick={() => navigate("/loja")}>Ver Promoções</button>
          </div>
        </section>

        {/* Seções */}
        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Novidades</h2>
          <div className={styles.cards}>
            {produtos.slice(0, 4).map((produto) => (
              <div
                key={produto.id_produto}
                className={styles.card}
                onClick={() => navigate(`/produtos/${produto.id_produto}`)}
              >
                <img
                  src={getImagemUrl(produto.imagem)}
                  alt={produto.nome_produto}
                  onError={(e) => (e.target.src = "https://placehold.co/300x180?text=Imagem+Indisponível")}
                />
                <div className={styles.cardInfo}>
                  <p>{produto.nome_produto}</p>
                  <span>R$ {Number(produto.preco).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Melhores Consoles</h2>
          <div className={styles.cards}>
            {produtos
              .filter(p => p.categoria === "Consoles")
              .map((produto) => (
                <div
                  key={produto.id_produto}
                  className={styles.card}
                  onClick={() => navigate(`/produtos/${produto.id_produto}`)}
                >
                  <img src={getImagemUrl(produto.imagem)} alt={produto.nome_produto} />
                  <div className={styles.cardInfo}>
                    <p>{produto.nome_produto}</p>
                    <span>R$ {Number(produto.preco).toFixed(2)}</span>
                  </div>
                </div>
              ))}
          </div>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Melhores Jogos</h2>
          <div className={styles.cards}>
            {produtos
              .filter(p => p.categoria === "Jogos")
              .map((produto) => (
                <div
                  key={produto.id_produto}
                  className={styles.card}
                  onClick={() => navigate(`/produtos/${produto.id_produto}`)}
                >
                  <img src={getImagemUrl(produto.imagem)} alt={produto.nome_produto} />
                  <div className={styles.cardInfo}>
                    <p>{produto.nome_produto}</p>
                    <span>R$ {Number(produto.preco).toFixed(2)}</span>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
