-- ============================================================
-- NUTRISTOCK - Script SQL Completo
-- ============================================================


-- ============================================================
-- 1. CREATE TABLES
-- ============================================================

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE doadores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    tipo_doador VARCHAR(50)
);

CREATE TABLE beneficiarios (
    id SERIAL PRIMARY KEY,
    nome_responsavel VARCHAR(100) NOT NULL,
    quantidade_membros INTEGER,
    endereco TEXT
);

CREATE TABLE alimentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    quantidade_kg DECIMAL(10,2) NOT NULL,
    data_validade DATE NOT NULL,
    categoria_id INTEGER,
    doador_id INTEGER,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (doador_id) REFERENCES doadores(id)
);

CREATE TABLE entregas (
    id SERIAL PRIMARY KEY,
    beneficiario_id INTEGER,
    alimento_id INTEGER,
    data_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantidade_entregue DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (beneficiario_id) REFERENCES beneficiarios(id),
    FOREIGN KEY (alimento_id) REFERENCES alimentos(id)
);


-- ============================================================
-- 2. INSERTS (3 por tabela)
-- ============================================================

INSERT INTO categorias (nome) VALUES
('Não-perecíveis'),
('Hortifruti'),
('Higiene e Limpeza');

INSERT INTO doadores (nome, telefone, tipo_doador) VALUES
('Mercado Central do Bairro', '11999999999', 'Supermercado'),
('Dona Maria Silva',          '11888888888', 'Pessoa Física'),
('Padaria Pão Quente',        '11777777777', 'Comércio Local');

INSERT INTO beneficiarios (nome_responsavel, quantidade_membros, endereco) VALUES
('João Santos',      4,  'Rua das Flores, 123'),
('Creche Esperança', 30, 'Av. Principal, 456'),
('Família Oliveira', 6,  'Rua do Sol, 789');

INSERT INTO alimentos (nome, quantidade_kg, data_validade, categoria_id, doador_id) VALUES
('Arroz Agulhinha 5kg', 50.0, '2027-05-10', 1, 1),
('Feijão Preto',        20.0, '2027-06-15', 1, 1),
('Maçã Nacional',       15.0, '2026-10-01', 2, 2);

INSERT INTO entregas (beneficiario_id, alimento_id, quantidade_entregue) VALUES
(1, 1, 5.0),
(2, 3, 10.0),
(3, 2, 4.0);


-- ============================================================
-- 3. SELECTS SIMPLES (uma por tabela)
-- ============================================================

SELECT * FROM categorias;

SELECT * FROM doadores;

SELECT * FROM beneficiarios;

SELECT * FROM alimentos;

SELECT * FROM entregas;


-- ============================================================
-- 4. SELECTS COM JOIN
-- ============================================================

-- Estoque completo: alimento com sua categoria e doador
SELECT
    a.nome            AS "Alimento",
    a.quantidade_kg   AS "Quantidade (kg)",
    a.data_validade   AS "Validade",
    c.nome            AS "Categoria",
    d.nome            AS "Doador",
    d.tipo_doador     AS "Tipo de Doador"
FROM alimentos a
JOIN categorias c ON a.categoria_id = c.id
JOIN doadores   d ON a.doador_id    = d.id
ORDER BY a.data_validade ASC;

-- Histórico de entregas: quem recebeu o quê e quando
SELECT
    b.nome_responsavel    AS "Família / Instituição",
    b.quantidade_membros  AS "Membros",
    al.nome               AS "Alimento Entregue",
    e.quantidade_entregue AS "Quantidade Recebida (kg)",
    e.data_entrega        AS "Data da Entrega"
FROM entregas    e
JOIN beneficiarios b  ON e.beneficiario_id = b.id
JOIN alimentos     al ON e.alimento_id     = al.id
ORDER BY e.data_entrega DESC;
