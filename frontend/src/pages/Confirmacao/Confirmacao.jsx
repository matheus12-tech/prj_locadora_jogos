import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./Confirmacao.module.css";

export default function Confirmacao() {
  const { state } = useLocation();
  const pagamento = state?.pagamento;

  if (!pagamento) return <p>Nenhum pagamento processado.</p>;

  return (
    <div>
      <h1>Pagamento realizado!</h1>
      <p>ID Pagamento: {pagamento.id_pagamento}</p>
      <p>Status: {pagamento.status}</p>
    </div>
  );
}
