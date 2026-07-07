const express = require("express");
const router = express.Router();
const passport = require("../../../config/passport");
const controller = require("../../../controllers/vendas/desconto/descontoController");

const autenticar = passport.authenticate("jwt", { session: false });

router.get("/descontos", autenticar, controller.listar);
router.post("/descontos", autenticar, controller.criar);


module.exports = router;