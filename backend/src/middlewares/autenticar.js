const jwt = require("jsonwebtoken");

function autenticar(req, res, next) {

  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token)
    return res.status(401).json({ erro: "Token de autenticação ausente" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; 
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(401).json({ erro: "Token expirado", expirado: true });

    return res.status(401).json({ erro: "Token inválido" });
  }
}

module.exports = autenticar;
