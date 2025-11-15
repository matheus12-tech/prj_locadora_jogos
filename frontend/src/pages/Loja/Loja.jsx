import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";   // ⬅ ADICIONADO NAVIGATE
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Loja.module.css";
import { listarCategorias } from "../../services/categoriasService";

const BASE_URL = "http://localhost:3000";

export default function Loja() {
  const navigate = useNavigate(); // ⬅ NECESSÁRIO PARA ABRIR ProdutoDetalhe
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

  // Construir URL da imagem
  const getImagemUrl = (imagem) => {
    if (!imagem) return "https://placehold.co/200x120?text=Sem+Imagem";
    if (imagem.startsWith("http")) return imagem;
    return `${BASE_URL}${imagem.startsWith("/") ? imagem : "/" + imagem}`;
  };

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

          <NavLink to="/carrinho" className={({ isActive }) => (isActive ? styles.ativo : "")}>Carrinho</NavLink>
        </nav>
      </aside>

      {/* Main layout */}
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
            <button onClick={() => navigate("/loja")}>Ver Promoções</button>
          </div>
          <img src="https://via.placeholder.com/500x250" alt="banner" />
        </section>

        {/* Categorias */}
        <section className={styles.categorias}>
          <h2>Categorias</h2>

          <div className={styles.categoriasGrid}>
            {categorias.map((c) => (
              <div
                key={c.id_categoria}
                className={`${styles.categoria} ${
                  categoriaSelecionada === c.id_categoria ? styles.categoriaAtiva : ""
                }`}
                onClick={() => filtrarPorCategoria(c.id_categoria)}
              >
                {c.nome_categoria}
              </div>
            ))}
          </div>
        </section>

        {/* Produtos */}
        <section className={styles.produtos}>
          <h2>Produtos em Destaque</h2>

          <div className={styles.cards}>

            {/* Card para ADMIN adicionar produtos */}
            {user?.role === "admin" && (
              <NavLink to="/cadastro-produto" className={styles.cardAdicionar}>
                <div className={styles.cardContent}>
                  <p>Adicionar Novo Produto</p>
                  <span>+</span>
                </div>
              </NavLink>
            )}

            {/* LISTAGEM DE PRODUTOS */}
            {produtosFiltrados.map((p) => (
              <div 
                key={p.id_produto} 
                className={styles.card}
                onClick={() => navigate(`/produtos/${p.id_produto}`)}   // ⬅ CARD ABRE DETALHE
              >
                <img
                  src={getImagemUrl(p.imagem)}
                  alt={p.nome_produto}
                />

                <div className={styles.cardInfo}>
                  <p>{p.nome_produto}</p>
                  <span>R$ {Number(p.preco).toFixed(2)}</span>
                  <p>Estoque: {p.estoque}</p>
                  <p>Categoria: {p.nome_categoria}</p>
                </div>

                {/* Botão Comprar = vai para DETALHE */}
                <button
                  className={styles.btnComprar}
                  onClick={(e) => {
                    e.stopPropagation();  // evita clicar no card inteiro
                    navigate(`/produtos/${p.id_produto}`);  // ⬅ COMO COMBINAMOS
                  }}
                >
                  Comprar
                </button>

              </div>
            ))}

          </div>
        </section>

      </main>
    </div>
  );
}
