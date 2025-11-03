import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>GAMESCOM</div>
      <nav className={styles.nav}>
        <NavLink to="/" className={({ isActive }) => isActive ? `${styles.link} ${styles.ativacao}` : styles.link}>Dashboard</NavLink>
        <NavLink to="/loja" className={({ isActive }) => isActive ? `${styles.link} ${styles.ativacao}` : styles.link}>Loja</NavLink>
        <NavLink to="/eventos" className={({ isActive }) => isActive ? `${styles.link} ${styles.ativacao}` : styles.link}>Eventos</NavLink>
        <a href="#">Favoritos</a>
        <a href="#">Promoções</a>
        <a href="#">Aluguéis</a>
        <a href="#">Novidades</a>
        <a href="#">Configurações</a>
      </nav>
      <div className={styles.desconto}>
        <p>Faça seu primeiro aluguél com 20%</p>
      </div>
    </aside>
  );
}