# integrador

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

# Instalação

## Clone o repositório

```bash
git clone https://github.com/MizaelGbb/PROJETO-INTEGRADOR/upload/main
```

---

# Backend

Crie um arquivo `.env` contendo:

```env
DB_HOST=localhost
DB_PORT=3000
DB_NAME=integr
DB_USER=postgres
DB_PASSWORD=sua_senha

JWT_SECRET=sua_chave_secreta
```
execute no terminal;

yarn install && yarn db:create && yarn db:migrate && yarn seed && yarn dev

# frontend

NO terminal:

cd frontend

yarn install

yarn dev

# Autores

Projeto desenvolvido para fins acadêmicos na disciplina de Integração de Sistemas.
