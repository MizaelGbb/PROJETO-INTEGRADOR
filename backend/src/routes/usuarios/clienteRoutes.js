const express = require("express");
const router = express.Router();
const passport = require("../../config/passport");
const controller = require("../../controllers/usuarios/clienteController");

const autenticar = passport.authenticate("jwt", { session: false });

router.post("/clientes", controller.criar); 

router.get("/clientes", autenticar, controller.listar);
router.get("/clientes/:id", autenticar, controller.buscar);
router.get("/clientes/:id/historico", autenticar, controller.historico);
router.put("/clientes/:id", autenticar, controller.atualizar);
router.delete("/clientes/:id", autenticar, controller.remover);

module.exports = router;