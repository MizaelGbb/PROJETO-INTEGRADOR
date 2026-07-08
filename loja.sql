-- demo_loja_eletronicos.sql
-- Dados iniciais para demonstração

START TRANSACTION;

INSERT INTO categorias (id_categoria,nome) VALUES
(1,'Celulares'),
(2,'Capinhas'),
(3,'Películas'),
(4,'Carregadores'),
(5,'Cabos'),
(6,'Fones de Ouvido'),
(7,'Smartwatch'),
(8,'Caixas de Som'),
(9,'Informática'),
(10,'Acessórios');

INSERT INTO fornecedor (id_fornecedor,nome,email,telefone,cnpj) VALUES
(1,'Tech Distribuidora','contato@techdist.com','49999990001','11111111000101'),
(2,'Master Eletrônicos','vendas@master.com','49999990002','11111111000102'),
(3,'Global Imports','contato@global.com','49999990003','11111111000103'),
(4,'Connect Mobile','contato@connect.com','49999990004','11111111000104'),
(5,'Power Tech','contato@power.com','49999990005','11111111000105');

INSERT INTO produtos
(id_produto,nome,id_categoria,custo,valor_final,estoque_minimo,quantidade_atual)
VALUES
(1,'Samsung Galaxy A16',1,0,1199.90,3,15),
(2,'Samsung Galaxy S24',1,0,4299.90,2,6),
(3,'Motorola Moto G85',1,0,1799.90,2,10),
(4,'iPhone 15 128GB',1,0,5299.90,2,4),
(5,'Capinha Galaxy A16',2,0,39.90,10,40),
(6,'Capinha iPhone 15 Transparente',2,0,49.90,10,35),
(7,'Película Galaxy A16',3,0,29.90,15,60),
(8,'Película iPhone 15',3,0,39.90,10,45),
(9,'Carregador USB-C 20W',4,0,79.90,8,28),
(10,'Carregador Turbo 25W',4,0,99.90,8,22),
(11,'Cabo USB-C 1m',5,0,24.90,15,80),
(12,'Cabo Lightning 1m',5,0,39.90,15,55),
(13,'Fone Bluetooth TWS',6,0,149.90,5,18),
(14,'Headset Gamer',6,0,249.90,3,9),
(15,'Smartwatch Fit Pro',7,0,399.90,3,12),
(16,'Caixa Bluetooth 20W',8,0,229.90,4,11),
(17,'Mouse Gamer RGB',9,0,119.90,5,25),
(18,'Teclado Mecânico',9,0,299.90,4,14),
(19,'SSD 480GB',9,0,269.90,5,20),
(20,'Suporte Veicular Magnético',10,0,59.90,10,30);

COMMIT;
