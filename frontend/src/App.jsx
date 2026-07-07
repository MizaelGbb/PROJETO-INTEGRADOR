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
import PrivateRoute from "./components/PrivateRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        //LOGIN
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar-cliente" element={<CadastroCliente />} />

        //COM ACESSO
        <Route path="/cadastrar-vendedor" element={<PrivateRoute>
          <CadastroVendedor />
        </PrivateRoute>} />

        //MENU VENDEDOR/GERENTE
        <Route path="/menu" element={<PrivateRoute>
            <Menu />
          </PrivateRoute>} />
        <Route path="/vender" element={<PrivateRoute>
          <Vender />
        </PrivateRoute>} />
        <Route path="/estoque" element={<PrivateRoute>
          <Estoque />
        </PrivateRoute>} />
        <Route path="/cadastrar-produto" element={<PrivateRoute>
          <CadastrarProduto />
        </PrivateRoute>} />
        <Route path="/cadastrar-fornecedor" element={<PrivateRoute>
          <CadastrarFornecedor />
        </PrivateRoute>} />
        <Route path="/cadastrar-desconto" element={<PrivateRoute>
          <CadastrarDesconto />
        </PrivateRoute>} />
        <Route path="/categorias" element={<PrivateRoute>
          <Categorias />
        </PrivateRoute>} />
        <Route path="/incluir-produtos" element={<PrivateRoute>
          <IncluirProdutos />
        </PrivateRoute>} />
        <Route path="/relatorio-vendas" element={<PrivateRoute>
          <RelatorioVendas />
        </PrivateRoute>} />

        //ACESSO CLIENTE 

        <Route path="/menu-cliente" element={<PrivateRoute>
            <MenuCliente />
          </PrivateRoute>} />
        <Route path="/clientes/:id/historico" element={<PrivateRoute>
          <HistoricoCompras />
          
          //PG default
        </PrivateRoute>} />
        <Route path="*" element={<h1>Página não encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;