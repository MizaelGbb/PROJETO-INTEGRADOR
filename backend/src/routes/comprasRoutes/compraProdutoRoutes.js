const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const controller = require("../controllers/compraProdutoController");

const autenticar = passport.authenticate("jwt", { session: false });

router.get("/compra-produto", autenticar, controller.listar);

router.get("/compra-produto/:id_compra/:id_produto", autenticar, controller.buscar);
router.post("/compra-produto", autenticar, controller.criar);
router.put("/compra-produto/:id_compra/:id_produto", autenticar, controller.atualizar);
router.delete("/compra-produto/:id_compra/:id_produto", autenticar, controller.remover);

module.exports = router;
