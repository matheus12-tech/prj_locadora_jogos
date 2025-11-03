import React from 'react';
import { NavLink, Outlet } from 'react-router-dom'; // 👈 importa o Outlet
import styles from './DashboardAdmin.module.css';


export default function DashboardAdmin() {
  const usuariosCount = 12;
  const produtosCount = 34;
  const eventosCount = 5;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>ADMIN DASHBOARD</div>
        <nav className={styles.nav}>
          <NavLink to="/admin" end className={({ isActive }) => isActive ? `${styles.link} ${styles.ativacao}` : styles.link}>Resumo</NavLink>
          <NavLink to="/usuarios" className={({ isActive }) => isActive ? `${styles.link} ${styles.ativacao}` : styles.link}>Usuários</NavLink>
          <NavLink to="/loja" className={({ isActive }) => isActive ? `${styles.link} ${styles.ativacao}` : styles.link}>Produtos</NavLink>
          <NavLink to="/eventos" className={({ isActive }) => isActive ? `${styles.link} ${styles.ativacao}` : styles.link}>Eventos</NavLink>
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

        {/* 👇 Aqui é onde será renderizado o conteúdo das rotas filhas */}
        <Outlet />

        {/* Se quiser manter o resumo como padrão */}
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