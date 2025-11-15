import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MeusAlugueis.module.css";

const BASE_URL = "http://localhost:3000";

export default function MeusAlugueis() {
  const [alugueis, setAlugueis] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/alugueis/meus-alugueis`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAlugueis(res.data);
    } catch (err) {
      console.error("Erro ao carregar aluguéis:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <p className={styles.container}>Carregando seus aluguéis...</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Meus Aluguéis</h1>

      {alugueis.length === 0 ? (
        <p>Você ainda não alugou nada.</p>
      ) : (
        <div className={styles.list}>
          {alugueis.map((a) => (
            <div className={styles.item} key={a.id_aluguel}>
              
              {/* INFO DO PRODUTO */}
              <div className={styles.itemInfo}>
                <h4>{a.nome_produto}</h4>
                <span>Data: {new Date(a.data_aluguel).toLocaleDateString("pt-BR")}</span>
                <span>Valor: R$ {Number(a.valor).toFixed(2)}</span>
              </div>

              {/* STATUS */}
              <span
                className={`${styles.status} ${styles[a.status.toLowerCase()]}`}
              >
                {a.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
