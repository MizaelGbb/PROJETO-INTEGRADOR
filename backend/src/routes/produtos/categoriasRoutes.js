const express = require("express");
const router = express.Router();
const controller = require("../../controllers/produtos/categoriaController");
const passport = require("../../config/passport"); 
const autenticar = passport.authenticate("jwt", { session: false });

router.get("/categorias", autenticar, controller.listar);
router.get("/categorias/:id", autenticar, controller.buscar);
router.post("/categorias", autenticar, controller.criar);
router.put("/categorias/:id", autenticar, controller.atualizar);
router.delete("/categorias/:id", autenticar, controller.remover);

module.exports = router;