import mysql from 'mysql2/promise';

let connection;

try {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'bmln1213',
    database: 'locadora_jogos_databaze',
    port: 3307
  });

  console.log('Conectado ao banco de dados com sucesso!');
} catch (err) {
  console.error('Erro ao conectar ao banco de dados:', err);
}

export default connection;