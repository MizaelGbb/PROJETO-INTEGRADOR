"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
require("dotenv").config();

const basename = path.basename(__filename);
const db = {};


const sequelize = new Sequelize(
  process.env.DB_NAME || "integr",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "sua_senha",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
    logging: false,
  }
);


function loadModels(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    if (fs.lstatSync(fullPath).isDirectory()) {
      loadModels(fullPath);
    } else {

      if (
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-3) === ".js" &&
        file.indexOf(".test.js") === -1
      ) {
        const modelImport = require(fullPath);

        let model;

        if (modelImport.init) {
          model = modelImport;
        }

        else if (typeof modelImport === "function") {
          model = modelImport(sequelize, Sequelize.DataTypes);
        }

        if (model && model.name) {
          db[model.name] = model;
        }
      }
    }
  });
}

loadModels(__dirname);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;