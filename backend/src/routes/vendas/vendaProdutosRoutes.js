const express = require("express");
const router = express.Router();
const passport = require("../../config/passport");
const controller = require("../../controllers/vendas/vendaProdutoController");

const autenticar = passport.authenticate("jwt", { session: false });

router.get("/vendaProdutos", autenticar, controller.listar);
router.get("/vendaProdutos/:id_venda/:id_produto", autenticar, controller.buscar);
router.post("/vendaProdutos", autenticar, controller.criar);
router.put("/vendaProdutos/:id_venda/:id_produto", autenticar, controller.atualizar);
router.delete("/vendaProdutos/:id_venda/:id_produto", autenticar, controller.remover);

module.exports = router;