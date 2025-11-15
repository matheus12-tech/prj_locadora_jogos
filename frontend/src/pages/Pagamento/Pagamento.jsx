import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Pagamento.module.css";

const BASE_URL = "http://localhost:3000";

export default function Pagamento() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { produto } = location.state || {};

  const [metodo, setMetodo] = useState("pix");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [nomeTitular, setNomeTitular] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [dias, setDias] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!produto) return <p>Nenhum produto selecionado para pagamento.</p>;

  const valor = Number(produto.valor_aluguel || produto.preco || 0);

  const handlePagamento = async () => {
    if (!user || isNaN(user.id)) {
      alert("Usuário não está logado.");
      return;
    }

    if (valor <= 0) {
      alert("Valor inválido.");
      return;
    }

    if (metodo === "cartao" && (!numeroCartao || !nomeTitular || !validade || !cvv)) {
      alert("Preencha todos os dados do cartão.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${BASE_URL}/alugueis`,
        {
          produto_id: produto.id_produto,
          usuario_id: user.id,
          dias,
          metodo,
          valor,
          numero_cartao: metodo === "cartao" ? numeroCartao : null,
          nome_titular: metodo === "cartao" ? nomeTitular : null,
          validade_cartao: metodo === "cartao" ? validade : null,
          cvv: metodo === "cartao" ? cvv : null,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      alert(`Pagamento registrado com sucesso!`);
      navigate("/confirmacao", { state: { pagamento: res.data } });
    } catch (err) {
      console.error("Erro ao processar pagamento:", err.response?.data || err);
      alert("Falha ao processar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Pagamento do Aluguel</h1>
      <p className={styles.valor}>Valor: R$ {valor.toFixed(2)}</p>

      <div>
        <label>Dias de aluguel:</label>
        <input type="number" value={dias} min="1" onChange={(e) => setDias(e.target.value)} />
      </div>

      <div className={styles.metodos}>
        <label>
          <input type="radio" value="pix" checked={metodo === "pix"} onChange={() => setMetodo("pix")} />
          PIX
        </label>
        <label>
          <input type="radio" value="cartao" checked={metodo === "cartao"} onChange={() => setMetodo("cartao")} />
          Cartão
        </label>
      </div>

      {metodo === "cartao" && (
        <div className={styles.cartao}>
          <input type="text" placeholder="Número do cartão" value={numeroCartao} onChange={(e) => setNumeroCartao(e.target.value)} />
          <input type="text" placeholder="Nome do titular" value={nomeTitular} onChange={(e) => setNomeTitular(e.target.value)} />
          <input type="text" placeholder="Validade MM/AA" value={validade} onChange={(e) => setValidade(e.target.value)} />
          <input type="text" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} />
        </div>
      )}

      <button onClick={handlePagamento} disabled={loading}>
        {loading ? "Processando..." : "Confirmar Pagamento"}
      </button>
    </div>
  );
}
