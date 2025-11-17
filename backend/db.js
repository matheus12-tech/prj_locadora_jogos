import mysql from 'mysql2/promise';

let connection;

try {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'locadora_jogos_databazee',
    port: 3306
  });

  console.log('Conectado ao banco de dados com sucesso!');
} catch (err) {
  console.error('Erro ao conectar ao banco de dados:', err);
}

export default connection;