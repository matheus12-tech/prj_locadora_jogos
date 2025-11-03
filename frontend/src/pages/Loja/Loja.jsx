import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Loja.module.css";
import { listarCategorias } from "../../services/categoriasService";

const BASE_URL = "http://localhost:3000";

export default function Loja() {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  // Buscar categorias
  const fetchCategorias = async () => {
    const data = await listarCategorias();
    setCategorias(data);
  };

  // Buscar produtos
  const fetchProdutos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/produtos`);
      setProdutos(res.data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  useEffect(() => {
    fetchCategorias();
    fetchProdutos();
  }, []);

  // Filtrar produtos por categoria
  const filtrarPorCategoria = (id) => {
    setCategoriaSelecionada((prev) => (prev === id ? null : id));
  };

  const produtosFiltrados = categoriaSelecionada
    ? produtos.filter((p) => p.categoria_id === categoriaSelecionada)
    : produtos;

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>GAMESCOM</div>
        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.ativo : "")}>Home</NavLink>
          <NavLink to="/loja" className={({ isActive }) => (isActive ? styles.ativo : "")}>Loja</NavLink>
          <NavLink to="/eventos" className={({ isActive }) => (isActive ? styles.ativo : "")}>Eventos</NavLink>
          <NavLink to="/favoritos" className={({ isActive }) => (isActive ? styles.ativo : "")}>Favoritos</NavLink>
        </nav>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <input type="text" placeholder="Pesquisar jogos..." className={styles.pesquisar} />
          <div className={styles.usuario}>
            <span>{user?.nome || "Visitante"}</span>
            <img src="https://via.placeholder.com/35" alt="avatar" className={styles.avatar} />
          </div>
        </header>

        {/* Banner */}
        <section className={styles.banner}>
          <div className={styles.bannerContent}>
            <h1>Ofertas Imperdíveis!</h1>
            <p>Descubra os jogos mais quentes do mês com até 50% de desconto!</p>
            <button>Ver Promoções</button>
          </div>
          <img src="https://via.placeholder.com/500x250" alt="banner" />
        </section>

        {/* Categorias */}
        <section className={styles.categorias}>
          <h2>Categorias</h2>

          {/* Grid de categorias clicáveis */}
          <div className={styles.categoriasGrid}>
            {categorias.map((c) => (
              <div
                key={c.id_categoria}
                className={`${styles.categoria} ${categoriaSelecionada === c.id_categoria ? styles.categoriaAtiva : ""}`}
                onClick={() => filtrarPorCategoria(c.id_categoria)}
              >
                {c.nome_categoria}
              </div>
            ))}
          </div>

          {/* Filtro por categoria */}
          <div style={{ marginTop: "1rem" }}>
            <span style={{ marginRight: "0.5rem" }}>Filtrar por categoria:</span>
            <button
              onClick={() => setCategoriaSelecionada(null)}
              style={{ marginRight: "0.5rem", padding: "0.3rem 0.6rem", cursor: "pointer" }}
            >
              Todas
            </button>
            {categorias.map((c) => (
              <button
                key={c.id_categoria}
                onClick={() => filtrarPorCategoria(c.id_categoria)}
                style={{
                  marginRight: "0.5rem",
                  padding: "0.3rem 0.6rem",
                  cursor: "pointer",
                  backgroundColor: categoriaSelecionada === c.id_categoria ? "#6C5CE7" : "#171A21",
                  color: categoriaSelecionada === c.id_categoria ? "white" : "#A0A0A0",
                  border: "1px solid #6C5CE7",
                  borderRadius: "5px",
                }}
              >
                {c.nome_categoria}
              </button>
            ))}
          </div>
        </section>

        {/* Produtos */}
        <section className={styles.produtos}>
          <h2>Produtos em Destaque</h2>
          <div className={styles.cards}>
            {user?.role === "admin" && (
              <NavLink to="/cadastro-produto" className={styles.cardAdicionar}>
                <div className={styles.cardContent}>
                  <p>Adicionar Novo Produto</p>
                  <span>+</span>
                </div>
              </NavLink>
            )}

            {produtosFiltrados.map((p) => (
              <div key={p.id_produto} className={styles.card}>
                <img src={p.imagem || "https://via.placeholder.com/200x120"} alt={p.nome_produto} />
                <div className={styles.cardInfo}>
                  <p>{p.nome_produto}</p>
                  <span>R$ {Number(p.preco).toFixed(2)}</span>
                  <p>Estoque: {p.estoque}</p>
                  <p>Categoria: {p.nome_categoria}</p>
                </div>
                <button className={styles.btnComprar}>Comprar</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
