import React from 'react';
import styles from './GameCard.module.css';

export default function GameCard({ title, price, img }) {
  return (
    <div className={styles.card}>
      <img src={img} alt={title} />
      <div className={styles.cardInfo}>
        <p>{title}</p>
        <span>{price}</span>
      </div>
    </div>
  );
}