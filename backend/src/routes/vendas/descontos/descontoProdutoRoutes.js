const express = require("express");
const router = express.Router();
const passport = require("../../../config/passport");
const controller = require("../../../controllers/vendas/desconto/descontoProdutoController");

const autenticar = passport.authenticate("jwt", { session: false });

router.get("/descontos-produto", autenticar, controller.listar);
router.get("/descontos-produto/:id", autenticar, controller.buscar);
router.post("/descontos-produto", autenticar, controller.criar);
router.put("/descontos-produto/:id", autenticar, controller.atualizar);
router.delete("/descontos-produto/:id", autenticar, controller.remover);

module.exports = router;