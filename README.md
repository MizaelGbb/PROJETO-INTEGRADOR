# integrador

## Dependências

| Dependência          | Versão  | Função Principal                                              |
| -------------------- | ------- | ------------------------------------------------------------- |
| bcrypt               | ^6.0.0  | Hashing de senhas                                             |
| dotenv               | ^17.4.2 | Variáveis de ambiente                                         |
| express              | ^4.18.2 | Framework web                                                 |
| jsonwebtoken         | ^9.0.3  | Autenticação (JWT)                                            |
| passport             | ^0.7.0  | Middleware de autenticação                                    |
| passport-jwt         | ^4.0.1  | Estratégia JWT para Passport                                  |
| pg                   | ^8.21.0 | Cliente PostgreSQL                                            |
| pg-connection-string | ^2.13.0 | Parsing de strings de conexão do banco                        |
| pg-hstore            | ^2.3.4  | Serialização de dados para Sequelize                          |
| react-router-dom     | ^7.18.1 | Roteamento para React                                         |
| sequelize            | ^6.37.8 | ORM para banco de dados                                       |
| nodemon              | ^3.1.14 | Reinicia automaticamente o servidor durante o desenvolvimento |
| sequelize-cli        | ^6.6.5  | Interface para gerenciar migrations e modelos Sequelize       |

## Instalação das dependências com Yarn

### Backend

```bash
cd backend

yarn install
```

Caso seja necessário instalar manualmente:

```bash
yarn add bcrypt dotenv express jsonwebtoken passport passport-jwt pg pg-connection-string pg-hstore sequelize
```

Dependências de desenvolvimento:

```bash
yarn add -D nodemon sequelize-cli
```

### Frontend

```bash
cd frontend

yarn install
```

Caso seja necessário instalar manualmente:

```bash
yarn add react-router-dom
```

---

# Sistema de Gestão Comercial

Sistema desenvolvido como projeto acadêmico para a disciplina de Integração de Sistemas. O objetivo é gerenciar clientes, vendedores, produtos, categorias e vendas por meio de uma API REST integrada a um frontend em React.

## Tecnologias Utilizadas

### Backend

* Node.js
* Express
* Sequelize
* PostgreSQL
* Passport JWT
* dotenv

### Frontend

* React
* React Router DOM
* CSS
* Lucide React

## Funcionalidades

* Autenticação de usuários com JWT
* Cadastro de clientes
* Cadastro de vendedores
* Cadastro de categorias
* Cadastro de produtos
* Cadastro de vendas
* Relacionamento entre produtos, categorias e vendas

## Estrutura do Projeto

```
backend/
├── config/
├── controllers/
├── models/
├── routes/
├── migrations/
├── seeders/
└── app.js

frontend/
├── src/
│   ├── pages/
│   ├── components/
│   ├── styles/
│   └── App.jsx
```

# Instalação

## Clone o repositório

```bash
git clone https://github.com/MizaelGbb/PROJETO-INTEGRADOR/upload/main
```

---

# Backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
yarn install
```

Crie um arquivo `.env` contendo:

```env
DB_HOST=localhost
DB_PORT=3000
DB_NAME=integr
DB_USER=postgres
DB_PASSWORD=sua_senha

JWT_SECRET=sua_chave_secreta
```

Execute as migrations:

```bash
yarn sequelize-cli db:migrate
```

Inicie o servidor:

```bash
yarn start
```

ou em modo desenvolvimento:

```bash
yarn dev
```

---

# Frontend

Entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
yarn install
```

Execute o projeto:

```bash
yarn dev
```

---

# Rotas Principais

## Autenticação

```
POST /auth/login
```

## Clientes

```
GET    /cadastra/clientes
POST   /cadastra/clientes
PUT    /cadastra/clientes/:id
DELETE /cadastra/clientes/:id
```

## Vendedores

```
GET    /cadastra/vendedores
POST   /cadastra/vendedores
PUT    /cadastra/vendedores/:id
DELETE /cadastra/vendedores/:id
```

## Categorias

```
GET    /cadastra/categorias
POST   /cadastra/categorias
PUT    /cadastra/categorias/:id
DELETE /cadastra/categorias/:id
```

## Produtos

```
GET    /cadastra/produtos
POST   /cadastra/produtos
PUT    /cadastra/produtos/:id
DELETE /cadastra/produtos/:id
```

## Vendas

```
GET    /cadastra/vendas
POST   /cadastra/vendas
PUT    /cadastra/vendas/:id
DELETE /cadastra/vendas/:id
```

# Autores

Projeto desenvolvido para fins acadêmicos na disciplina de Integração de Sistemas.
