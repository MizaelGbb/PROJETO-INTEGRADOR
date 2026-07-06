const express = require("express");
const router = express.Router();
const passport = require("../../config/passport");
const controller = require("../../controllers/Compras/forntecedorController");

const autenticar = passport.authenticate("jwt", { session: false });

router.get("/fornecedores", autenticar, controller.listar);
router.get("/fornecedores/:id", autenticar, controller.buscar);
router.post("/fornecedores", autenticar, controller.criar);
router.put("/fornecedores/:id", autenticar, controller.atualizar);
router.delete("/fornecedores/:id", autenticar, controller.remover);

module.exports = router;