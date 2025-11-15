import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';
import styles from './DashboardAdmin.module.css';

export default function DashboardAdmin() {
  const [usuariosCount, setUsuariosCount] = useState(0);
  const [produtosCount, setProdutosCount] = useState(0);
  const [eventosCount, setEventosCount] = useState(0);

  useEffect(() => {
    // 🔹 Pega a contagem real de usuários
    axios.get('http://localhost:3000/usuarios')
      .then(res => setUsuariosCount(res.data.length))
      .catch(() => setUsuariosCount(0));

    // 🔹 Pega a contagem real de produtos
    axios.get('http://localhost:3000/produtos')
      .then(res => setProdutosCount(res.data.length))
      .catch(() => setProdutosCount(0));

    // 🔹 Pega a contagem real de eventos
    axios.get('http://localhost:3000/evento')
      .then(res => setEventosCount(res.data.length))
      .catch(() => setEventosCount(0));
  }, []);

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>ADMIN DASHBOARD</div>
        <nav className={styles.nav}>
          <NavLink to="/admin" end className={({ isActive }) => isActive ? `${styles.link} ${styles.ativacao}` : styles.link}>Resumo</NavLink>
          <NavLink to="/usuarios" className={({ isActive }) => isActive ? `${styles.link} ${styles.ativacao}` : styles.link}>Usuários</NavLink>
          <NavLink to="/loja" className={({ isActive }) => isActive ? `${styles.link} ${styles.ativacao}` : styles.link}>Produtos</NavLink>
          <NavLink to="/eventos" className={({ isActive }) => isActive ? `${styles.link} ${styles.ativacao}` : styles.link}>Eventos</NavLink>
          <NavLink to="/" className={({ isActive }) => isActive ? `${styles.link} ${styles.ativacao}` : styles.link}>Ir para Home</NavLink>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <input type="text" placeholder="Pesquisar" className={styles.pesquisar} />
          <div className={styles.usuario}>
            <span>Admin</span>
            <img src="https://via.placeholder.com/30" alt="user" className={styles.avatar} />
          </div>
        </header>

        <Outlet />

        <section className={styles.cards}>
          <div className={styles.card}>
            <h2>Usuários</h2>
            <p>{usuariosCount}</p>
          </div>
          <div className={styles.card}>
            <h2>Produtos</h2>
            <p>{produtosCount}</p>
          </div>
          <div className={styles.card}>
            <h2>Eventos</h2>
            <p>{eventosCount}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
