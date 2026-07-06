const express = require("express");
const router = express.Router();

const passport = require("../../config/passport"); 
const controller = require("../../controllers/produtos/produtoController");

const autenticar = passport.authenticate("jwt", { session: false });

router.get("/produtos", autenticar, controller.listar);
router.get("/produtos/:id", autenticar, controller.buscar);
router.post("/produtos", autenticar, controller.criar);
router.put("/produtos/:id", autenticar, controller.atualizar);
router.delete("/produtos/:id", autenticar, controller.remover);

module.exports = router;