-- ================================================
-- Script de criação do banco e dados iniciais
-- Banco: pedidos_online_db
-- ================================================

CREATE DATABASE IF NOT EXISTS pedidos_online_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE pedidos_online_db;

-- ================================================
-- TABELA: usuarios
-- ================================================
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inserir usuário padrão (Miguel)
-- Senha: 123456 (texto plano)
INSERT INTO usuarios (nome, email, senha)
VALUES ('Miguel', 'miguel@empresa.com.br', '123456');

-- ================================================
-- TABELA: vendas
-- ================================================
DROP TABLE IF EXISTS vendas;

CREATE TABLE vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendedor VARCHAR(100) NOT NULL,
    cliente VARCHAR(100) NOT NULL,
    unidade ENUM('Salvador', 'Feira de Santana', 'Lauro de Freitas') NOT NULL,
    valor_venda DECIMAL(10,2) NOT NULL,
    data_venda TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- Inserção de 30 vendas
-- ================================================

INSERT INTO vendas (vendedor, cliente, unidade, valor_venda, data_venda) VALUES
('Carlos Souza', 'João Lima', 'Salvador', 1200.50, '2024-01-15 10:20:00'),
('Ana Paula', 'Fernanda Rocha', 'Feira de Santana', 980.75, '2024-02-10 14:30:00'),
('Marcos Silva', 'Cláudio Oliveira', 'Feira de Santana', 430.00, '2024-03-22 11:10:00'),
('Bruna Costa', 'Marina Santos', 'Lauro de Freitas', 1500.90, '2024-04-08 09:45:00'),
('Felipe Almeida', 'Ricardo Souza', 'Salvador', 220.00, '2024-05-19 17:00:00'),
('Joana Pereira', 'Rita Campos', 'Feira de Santana', 3100.00, '2024-06-11 08:40:00'),
('Rafael Santos', 'Gabriel Teixeira', 'Lauro de Freitas', 890.25, '2024-07-04 10:00:00'),
('Juliana Lima', 'Aline Costa', 'Salvador', 1050.00, '2024-08-16 13:15:00'),
('Pedro Nunes', 'Bruno Moreira', 'Feira de Santana', 500.00, '2024-09-29 15:00:00'),
('Patrícia Souza', 'Daniela Ramos', 'Lauro de Freitas', 275.40, '2024-10-10 16:50:00'),
('Marcos Silva', 'José Alves', 'Salvador', 1950.00, '2024-11-05 12:00:00'),
('Carlos Souza', 'Amanda Gomes', 'Feira de Santana', 840.00, '2024-12-17 10:00:00'),
('Ana Paula', 'Lucas Rocha', 'Lauro de Freitas', 150.00, '2024-12-28 11:30:00'),
('Felipe Almeida', 'Márcia Nogueira', 'Feira de Santana', 290.00, '2024-11-23 09:15:00'),
('Bruna Costa', 'Tiago Melo', 'Salvador', 450.00, '2024-10-30 14:00:00'),
('Carlos Souza', 'João Lima', 'Feira de Santana', 1100.00, '2025-01-12 10:00:00'),
('Ana Paula', 'Fernanda Rocha', 'Lauro de Freitas', 850.00, '2025-02-07 14:00:00'),
('Marcos Silva', 'Cláudio Oliveira', 'Salvador', 3000.00, '2025-03-15 11:10:00'),
('Bruna Costa', 'Marina Santos', 'Feira de Santana', 270.00, '2025-04-09 09:45:00'),
('Felipe Almeida', 'Ricardo Souza', 'Lauro de Freitas', 1230.00, '2025-05-14 17:00:00'),
('Joana Pereira', 'Rita Campos', 'Salvador', 455.00, '2025-06-21 08:40:00'),
('Rafael Santos', 'Gabriel Teixeira', 'Feira de Santana', 1980.00, '2025-07-13 10:00:00'),
('Juliana Lima', 'Aline Costa', 'Lauro de Freitas', 920.00, '2025-08-08 13:15:00'),
('Pedro Nunes', 'Bruno Moreira', 'Salvador', 250.00, '2025-09-19 15:00:00'),
('Patrícia Souza', 'Daniela Ramos', 'Feira de Santana', 330.00, '2025-10-25 16:50:00'),
('Marcos Silva', 'José Alves', 'Lauro de Freitas', 1500.00, '2025-11-02 12:00:00'),
('Carlos Souza', 'Amanda Gomes', 'Salvador', 680.00, '2025-11-11 10:00:00'),
('Ana Paula', 'Lucas Rocha', 'Feira de Santana', 2750.00, '2025-12-05 11:30:00'),
('Felipe Almeida', 'Márcia Nogueira', 'Lauro de Freitas', 480.00, '2025-12-20 09:15:00'),
('Bruna Costa', 'Tiago Melo', 'Salvador', 1999.99, '2025-12-31 14:00:00');