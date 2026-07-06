require("dotenv").config();
module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "integr",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
    logging: console.log, // exibe SQL gerado no terminal (útil em dev)
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST || "integr_test",
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false, // silencioso em testes
  },
  production: {
    use_env_variable: "DATABASE_URL", // Heroku/Railway/Render fornecem isso
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  },
};
