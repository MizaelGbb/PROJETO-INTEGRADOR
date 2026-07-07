const express = require("express");
const router = express.Router();
const passport = require("../../config/passport");
const controller = require("../../controllers/usuarios/vendedorController");

const autenticar = passport.authenticate("jwt", { session: false });


router.post("/vendedores", autenticar, controller.registrarFuncionario);

router.get("/vendedores", autenticar, controller.listar);
router.get("/vendedores/:id", autenticar, controller.buscar);
router.put("/vendedores/:id", autenticar, controller.atualizar);
router.delete("/vendedores/:id", autenticar, controller.remover);

module.exports = router;