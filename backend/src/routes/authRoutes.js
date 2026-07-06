// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

router.post("/registrar", AuthController.registrar);
router.post("/login", AuthController.login);

const path = require("path");

module.exports = router;
