import { BrowserRouter, Routes, Route } from "react-router-dom";
import CadastroCliente from "./pages/login/CadastrarCliente";
import CadastroVendedor from "./pages/login/CadastrarVendedor";
import Login from "./pages/login/login";
import Menu from "./pages/MenuGeral";
import Vender from "./pages/RealizarVenda";
import Estoque from "./pages/Estoque";
import CadastrarProduto from "./pages/CadastrarProduto";
import CadastrarDesconto from "./pages/CadastrarDesconto";
import CadastrarFornecedor from "./pages/CadastrarFornecedor";
import Categorias from "./pages/CadastrarCategoria";
import IncluirProdutos from "./pages/IncluirProdutos";
import RelatorioVendas from "./pages/RelatorioVendas";
import MenuCliente from "./pages/MenuCliente";
import HistoricoCompras from "./pages/HistoricoCompras";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar-cliente" element={<CadastroCliente />} />
        <Route path="/cadastrar-vendedor" element={<CadastroVendedor />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/vender" element={<Vender />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/cadastrar-produto" element={<CadastrarProduto />} />
        <Route path="/cadastrar-fornecedor" element={<CadastrarFornecedor />} />
        <Route path="/cadastrar-desconto" element={<CadastrarDesconto />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/incluir-produtos" element={<IncluirProdutos />} />
        <Route path="/relatorio-vendas" element={<RelatorioVendas />} />
        <Route path="/menu-cliente" element={<MenuCliente />} />
        <Route path="/clientes/:id/historico" element={<HistoricoCompras />} />
        <Route path="*" element={<h1>Página não encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;