import React from 'react';
import styles from './Banner.module.css';

export default function Banner() {
  return (
    <section className={styles.banner}>
      <div className={styles.bannerText}>
        <h1>Onde os pixels nascem...<br /> E você acorda </h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <button>Check Now</button>
      </div>
      <div className={styles.bannerImg}></div>
    </section>
  );
}