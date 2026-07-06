const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const controller = require("../../controllers/Compras/compraController");

const autenticar = passport.authenticate("jwt", { session: false });


router.get("/compras", autenticar, controller.listar);
router.get("/compras/:id", autenticar, controller.buscar);
router.post("/compras", autenticar, controller.criar);
router.put("/compras/:id", autenticar, controller.atualizar);
router.delete("/compras/:id", autenticar, controller.remover);

module.exports = router;