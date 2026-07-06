const express = require("express");
const router = express.Router();
const passport = require("../../config/passport");
const controller = require("../../controllers/usuarios/usuariosController");

const autenticar = passport.authenticate("jwt", { session: false });

router.post("/usuarios", autenticar, controller.criar);

router.get("/usuarios", autenticar, controller.listar);
router.get("/usuarios/:id", autenticar, controller.buscar);
router.put("/usuarios/:id", autenticar, controller.atualizar);
router.delete("/usuarios/:id", autenticar, controller.remover);

module.exports = router;