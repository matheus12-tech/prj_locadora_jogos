# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


```sql
create database locadora_jogos_databazee;
use locadora_jogos_databazee;
-- ===============================================
-- Banco de dados: locadora_jogos
-- ===============================================
-- ===============================================
-- Tabela: tb_login (usuários)
-- ===============================================
drop table tb_login;
CREATE TABLE IF NOT EXISTS tb_login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role ENUM('admin','usuario') NOT NULL DEFAULT 'usuario',
    status VARCHAR(20) DEFAULT 'ativo'
);

-- ===============================================
-- Tabela: tb_categorias
-- ===============================================
CREATE TABLE IF NOT EXISTS tb_categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome_categoria VARCHAR(255) NOT NULL
);

-- ===============================================
-- Tabela: tb_produtos
-- ===============================================
CREATE TABLE IF NOT EXISTS tb_produtos (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome_produto VARCHAR(40) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL,
    imagem VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES tb_categorias(id_categoria) ON DELETE SET NULL
);

-- ===============================================
-- Tabela: tb_eventos
-- ===============================================
CREATE TABLE IF NOT EXISTS tb_eventos (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    local VARCHAR(100),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- Tabela: tb_alugueis
-- ===============================================
CREATE TABLE IF NOT EXISTS tb_alugueis (
    id_aluguel INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    produto_id INT NOT NULL,
    data_aluguel DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_devolucao DATETIME,
    status ENUM('pendente','ativo','finalizado','cancelado') DEFAULT 'pendente',
    valor DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES tb_login(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES tb_produtos(id_produto) ON DELETE CASCADE
);

-- ===============================================
-- Tabela: tb_pagamentos
-- ===============================================
CREATE TABLE IF NOT EXISTS tb_pagamentos (
    id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
    aluguel_id INT NOT NULL,
    metodo ENUM('pix','cartao') NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    status ENUM('pendente','pago','falhou','cancelado') DEFAULT 'pendente',
    data_pagamento DATETIME DEFAULT CURRENT_TIMESTAMP,
    codigo_pix VARCHAR(255),
    numero_cartao VARCHAR(20),
    nome_titular VARCHAR(100),
    validade_cartao VARCHAR(5),
    cvv VARCHAR(4),
    FOREIGN KEY (aluguel_id) REFERENCES tb_alugueis(id_aluguel) ON DELETE CASCADE
);

-- ===============================================
-- Tabela: tb_inscricoes (para eventos)
-- ===============================================
CREATE TABLE IF NOT EXISTS tb_inscricoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_id INT NOT NULL,
    usuario_id INT NOT NULL,
    data_inscricao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (evento_id) REFERENCES tb_eventos(id_evento) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES tb_login(id) ON DELETE CASCADE
);

-- ===============================================
-- Tabela: tb_advertencias
-- ===============================================
CREATE TABLE IF NOT EXISTS tb_advertencias (
    id_advertencia INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_aplicador INT,
    motivo VARCHAR(255) NOT NULL,
    data_aplicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES tb_login(id) ON DELETE CASCADE,
    FOREIGN KEY (id_aplicador) REFERENCES tb_login(id) ON DELETE SET NULL
);

-- ===============================================
-- Inserir um admin inicial
-- ===============================================
INSERT INTO tb_login (nome, email, senha, role, status)
VALUES ('Administrador', 'admin@locadora.com', 
        '$2b$10$iv.6Z9mmnICxdonS5Uh1ROd2kpa0fd4PRqnXhXbF6uYBIAs231hyW', 
        'admin', 'ativo');


INSERT INTO tb_categorias (nome_categoria) VALUES
('Consoles'),
('Jogos'),
('RPG'),
('Ação'),
('Aventura'),
('Esportes'),
('Corrida'),
('Luta'),
('Acessórios');
```
