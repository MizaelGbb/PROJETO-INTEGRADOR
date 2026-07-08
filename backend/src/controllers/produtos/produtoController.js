const {
  Produto,
  Categoria,
  Compra,
  Venda,
  DescontoProduto,
  Desconto,
  DescontoCategoria
} = require("../../models");

const { Op } = require("sequelize");

//LISTAR COM DESCONTO
async function listar(req, res) {
  try {
    const hoje = new Date();

    const produtos = await Produto.findAll({
      include: [
        { model: Categoria, as: "categoria" }
      ]
    });

    const resultado = [];

    for (const produto of produtos) {

      let precoOriginal = produto.valor_final;
      let precoFinal = produto.valor_final;
      let descontoAplicado = null;

      const descProduto = await DescontoProduto.findOne({
        where: { id_produto: produto.id_produto },
        include: [{
          model: Desconto,
          as: "dadosDesconto",
          where: {
            data_inicio: { [Op.lte]: hoje },
            data_fim: { [Op.gte]: hoje }
          }
        }]
      });

      if (descProduto) {
        precoFinal = descProduto.novo_valor;
        descontoAplicado = "produto";

      } else {
        const descCategoria = await DescontoCategoria.findOne({
          where: { id_categoria: produto.id_categoria },
          include: [{
            model: Desconto,
            as: "dadosDesconto",
            where: {
              data_inicio: { [Op.lte]: hoje },
              data_fim: { [Op.gte]: hoje }
            }
          }]
        });

        if (descCategoria) {
          precoFinal = precoOriginal - (
            precoOriginal * (descCategoria.porcentagem_desconto / 100)
          );
          descontoAplicado = "categoria";
        }
      }

      resultado.push({
        ...produto.toJSON(),
        preco_original: precoOriginal,
        preco_final: precoFinal,
        desconto_aplicado: descontoAplicado
      });
    }

    res.json(resultado);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}


const buscar = async (req, res) => {
  try {
    const { id } = req.params;
    const hoje = new Date();

    const produto = await Produto.findByPk(id, {
      include: [
        { model: Categoria, as: "categoria" }
      ]
    });

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    let precoOriginal = produto.valor_final;
    let precoFinal = produto.valor_final;
    let descontoAplicado = null;

    const descProduto = await DescontoProduto.findOne({
      where: { id_produto: produto.id_produto },
      include: [{
        model: Desconto,
        as: "dadosDesconto",
        where: {
          data_inicio: { [Op.lte]: hoje },
          data_fim: { [Op.gte]: hoje }
        }
      }]
    });

    if (descProduto) {
      precoFinal = descProduto.novo_valor;
      descontoAplicado = "produto";

    } else {
      const descCategoria = await DescontoCategoria.findOne({
        where: { id_categoria: produto.id_categoria },
        include: [{
          model: Desconto,
          as: "dadosDesconto",
          where: {
            data_inicio: { [Op.lte]: hoje },
            data_fim: { [Op.gte]: hoje }
          }
        }]
      });

      if (descCategoria) {
        precoFinal = precoOriginal - (
          precoOriginal * (descCategoria.porcentagem_desconto / 100)
        );
        descontoAplicado = "categoria";
      }
    }

    return res.json({
      ...produto.toJSON(),
      preco_original: precoOriginal,
      preco_final: precoFinal,
      desconto_aplicado: descontoAplicado
    });

  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro ao buscar produto" });
  }
};


// CRIAR
const criar = async (req, res) => {
  try {
    const {
      nome,
      id_categoria,
      valor_final,
      estoque_minimo,
    } = req.body;

    const novoProduto = await Produto.create({
      nome,
      id_categoria,
      custo: 0,
      valor_final,
      estoque_minimo,
      quantidade_atual: 0,
    });

    return res.status(201).json(novoProduto);

  } catch (erro) {
    return res.status(500).json({
      erro: erro.errors?.[0]?.message || "Erro ao criar produto",
    });
  }
};


// ATUALIZAR
const atualizar = async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    const {
      nome,
      id_categoria,
      valor_final,
      estoque_minimo,
    } = req.body;

    await produto.update({
      nome,
      id_categoria,
      valor_final,
      estoque_minimo,
    });

    return res.json(produto);

  } catch (erro) {
    return res.status(500).json({
      erro: erro.errors?.[0]?.message || "Erro ao atualizar produto",
    });
  }
};


// REMOVER
const remover = async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    await produto.destroy();

    return res.status(204).send();

  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao remover produto" });
  }
};


module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  remover,
};
