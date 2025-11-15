import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Usuarios.module.css";

const BASE_URL = "http://localhost:3000";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [motivo, setMotivo] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const alterarStatus = async (id, novoStatus) => {
    try {
      await axios.patch(
        `${BASE_URL}/usuarios/${id}/status`,
        { status: novoStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsuarios();
    } catch (err) {
      console.error("Erro ao alterar status:", err);
      alert("Não foi possível alterar o status do usuário.");
    }
  };

  const aplicarAdvertencia = async (id) => {
    const motivoInput = prompt("Informe o motivo da advertência:");
    if (!motivoInput) return;

    try {
      await axios.post(
        `${BASE_URL}/usuarios/${id}/advertencia`,
        { motivo: motivoInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsuarios();
    } catch (err) {
      console.error("Erro ao aplicar advertência:", err);
      alert("Não foi possível aplicar a advertência.");
    }
  };

  if (loading) return <p>Carregando usuários...</p>;

  return (
    <div className={styles.container}>
      <h1>Gestão de Usuários</h1>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Status</th>
            <th>Advertências</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nome}</td>
              <td>{u.email}</td>
              <td>{u.status}</td>
              <td>{u.total_advertencias}</td>
              <td>
                {u.status === "ativo" ? (
                  <button onClick={() => alterarStatus(u.id, "banido")}>Banir</button>
                ) : (
                  <button onClick={() => alterarStatus(u.id, "ativo")}>Desbanir</button>
                )}
                <button onClick={() => aplicarAdvertencia(u.id)}>⚠️ Advertir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
