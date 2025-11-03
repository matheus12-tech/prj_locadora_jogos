import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ProdutoDetalhe.module.css";

const BASE_URL = "http://localhost:3000"; // Backend

export default function ProdutoDetalhe() {
  const { id } = useParams(); // id da URL
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/produtos/${id}`);
        setProduto(res.data);
      } catch (err) {
        console.error("Erro ao buscar produto:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduto();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (!produto) return <p>Produto não encontrado.</p>;

  return (
    <div className={styles.container}>
      <img
        src={produto.imagem || "https://via.placeholder.com/400x300"}
        alt={produto.nome_produto}
        className={styles.imagem}
      />
      <div className={styles.info}>
        <h2>{produto.nome_produto}</h2>
        <p>{produto.descricao}</p>
        <p>Preço: ${produto.preco}</p>
        <p>Estoque: {produto.estoque}</p>
        <p>Categoria: {produto.nome_categoria || "N/A"}</p>
      </div>
    </div>
  );
}
