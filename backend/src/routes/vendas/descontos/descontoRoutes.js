const express = require("express");
const router = express.Router();
const passport = require("../../../config/passport");
const controller = require("../../../controllers/vendas/desconto/descontoController");

const autenticar = passport.authenticate("jwt", { session: false });

router.get("/descontos", autenticar, controller.listar);
router.get("/descontos/:id", autenticar, controller.buscar);
router.post("/descontos", autenticar, controller.criar);
router.put("/descontos/:id", autenticar, controller.atualizar);
router.delete("/descontos/:id", autenticar, controller.remover);

module.exports = router;