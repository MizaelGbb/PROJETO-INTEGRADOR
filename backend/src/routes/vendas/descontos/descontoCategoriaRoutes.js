const express = require("express");
const router = express.Router();
const passport = require("../../../config/passport");
const controller = require("../../../controllers/vendas/desconto/descontoCategoriaController");

const autenticar = passport.authenticate("jwt", { session: false });

router.get("/descontos-categoria", autenticar, controller.listar);
router.get("/descontos-categoria/:id", autenticar, controller.buscar);
router.post("/descontos-categoria", autenticar, controller.criar);
router.put("/descontos-categoria/:id", autenticar, controller.atualizar);
router.delete("/descontos-categoria/:id", autenticar, controller.remover);

module.exports = router;