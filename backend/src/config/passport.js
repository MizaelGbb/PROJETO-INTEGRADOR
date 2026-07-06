const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const db = require("../models"); 
const opcoes = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  ignoreExpiration: false,
};

passport.use(
  new JwtStrategy(opcoes, async (payload, done) => {
    try {
      
      const usuario = await db.Usuario.findByPk(payload.id, {
        attributes: { exclude: ["senha"] }, 
      });

      if (!usuario) {
        return done(null, false);
      }

      return done(null, usuario); 
    } catch (err) {
      return done(err); 
    }
  }),
);

module.exports = passport;
