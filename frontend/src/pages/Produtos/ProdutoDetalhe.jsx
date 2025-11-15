import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./ProdutoDetalhe.module.css";

const BASE_URL = "http://localhost:3000";

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const alugarAgora = () => {
    if (!user) {
      alert("Você precisa estar logado para alugar.");
      return;
    }

    navigate("/pagamentos", {
      state: {
        tipo: "aluguel",
        produto: produto,
      },
    });
  };

  if (loading) return <p className={styles.loading}>Carregando...</p>;
  if (!produto) return <p className={styles.error}>Produto não encontrado.</p>;

  const imagemUrl = produto.imagem
    ? `${BASE_URL}${produto.imagem.startsWith("/") ? produto.imagem : `/${produto.imagem}`}`
    : "https://via.placeholder.com/1200x600?text=Sem+Imagem";

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${imagemUrl})` }}>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <img src={imagemUrl} alt={produto.nome_produto} className={styles.imagem} />

          <div className={styles.info}>
            <h1 className={styles.nome}>{produto.nome_produto}</h1>
            <p className={styles.descricao}>{produto.descricao}</p>

            <div className={styles.detalhes}>
              <p><strong>Categoria:</strong> {produto.nome_categoria || "N/A"}</p>
              <p><strong>Estoque:</strong> {produto.estoque}</p>
              <p className={styles.preco}>R$ {Number(produto.preco || 0).toFixed(2)}</p>
            </div>

            <div className={styles.acoes}>
              <button className={styles.btnAlugar} onClick={alugarAgora}>
                Alugar Agora
              </button>

              <button className={styles.btnVoltar} onClick={() => navigate(-1)}>
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
