import React, { useEffect, useState } from "react";
import styles from "./Carrinho.module.css";
import { useNavigate } from "react-router-dom";

export default function Carrinho() {
  const navigate = useNavigate();
  const [itens, setItens] = useState([]);

  useEffect(() => {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    setItens(carrinho);
  }, []);

  const removerItem = (id) => {
    const atualizado = itens.filter((item) => item.id_produto !== id);
    setItens(atualizado);
    localStorage.setItem("carrinho", JSON.stringify(atualizado));
  };

  const finalizarCompra = () => {
    navigate("/pagamento", {
      state: {
        tipo: "carrinho",
        itens: itens
      }
    });
  };

  const total = itens.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

  return (
    <div className={styles.container}>
      <h1>Carrinho</h1>

      {itens.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <div className={styles.lista}>
            {itens.map((item) => (
              <div key={item.id_produto} className={styles.item}>
                <img src={item.imagem} alt={item.nome_produto} />

                <div className={styles.info}>
                  <h3>{item.nome_produto}</h3>
                  <p>R$ {Number(item.preco).toFixed(2)}</p>
                </div>

                <button
                  className={styles.remover}
                  onClick={() => removerItem(item.id_produto)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          <div className={styles.total}>
            <h2>Total: R$ {total.toFixed(2)}</h2>
            <button className={styles.btnPagar} onClick={finalizarCompra}>
              Finalizar Pagamento
            </button>
          </div>
        </>
      )}
    </div>
  );
}
