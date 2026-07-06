const express = require("express");
const router = express.Router();
const passport = require("../../config/passport");
const controller = require("../../controllers/vendas/vendaController");


const autenticar = passport.authenticate("jwt", { session: false });

router.get("/vendas", autenticar, controller.listar);

router.get("/vendas/:id", autenticar, controller.buscar);
router.post("/vendas", autenticar, controller.criar);
router.put("/vendas/:id", autenticar, controller.atualizar);
router.delete("/vendas/:id", autenticar, controller.remover);

module.exports = router;