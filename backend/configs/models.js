'use strict';
require('dotenv').load()
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.APP_ENV || 'development';
const configs = require('./configs')
const config = configs.database[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const directoryModulesPath = path.join(__dirname, '../modules');
const modules = configs.modules;

for (const module of modules) {
    const moduleModelsDir = directoryModulesPath + '/' + module + '/models';
    fs.readdirSync(moduleModelsDir)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file !== 'index.js') && (file.slice(-3) === '.js');
        })
        .forEach(file => {
            const model = require(path.join(moduleModelsDir, file))(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
        });
}

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
