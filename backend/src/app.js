const express = require("express");
const passport = require("./config/passport"); // Importa e configura a estratégia

const authRoutes = require("./routes/authRoutes");
const path = require("path");
const app = express();

const cadastroUsuario = require("./routes/usuarios/usuariosRoutes");
const cadastroCliente = require("./routes/usuarios/clienteRoutes");
const cadastroVendedor = require("./routes/usuarios/vendedorRoutes");
const cadastroProduto = require("./routes/produtos/produtosRoutes");
const cadastroCategoria = require("./routes/produtos/categoriasRoutes");
const cadastroFornecedor = require("./routes/comprasRoutes/fornecedorRoutes");
const cadastroVenda = require("./routes/vendas/vendaRoutes");
const cadastroDesconto = require("./routes/vendas/descontos/descontoRoutes");
const cadastroCompra = require("./routes/comprasRoutes/compraRoutes");
const cadastroDescontoCategoria = require("./routes/vendas/descontos/descontoCategoriaRoutes");
const cadastroDescontoProduto = require("./routes/vendas/descontos/descontoProdutoRoutes");
const cors = require("cors");
//const { default: CadastrarCategoria } = require("../../frontend/src/pages/CadastrarCategoria");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());



app.use("/cadastra", cadastroCliente);
app.use("/cadastra", cadastroVendedor);
app.use("/cadastra", cadastroUsuario);
app.use("/cadastra", cadastroProduto);
app.use("/cadastra", cadastroCategoria);
app.use("/cadastra", cadastroVenda);
app.use("/cadastra", cadastroFornecedor);
app.use("/cadastra", cadastroCompra);
app.use("/cadastra", cadastroDesconto);
app.use("/cadastra", cadastroDescontoCategoria);
app.use("/cadastra", cadastroDescontoProduto);
app.use("/auth", authRoutes);


module.exports = app;
