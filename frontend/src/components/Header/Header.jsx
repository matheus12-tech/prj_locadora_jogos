import React from 'react';
import styles from './Header.module.css';

export default function Header({ username = "Veneza" }) {
  return (
    <header className={styles.header}>
      <input
        type="text"
        placeholder="Pesquisar"
        className={styles.pesquisar}
      />
      <div className={styles.usuario}>
        <span>{username}</span>
        <img
          src="https://via.placeholder.com/30"
          alt="user"
          className={styles.avatar}
        />
      </div>
    </header>
  );
}