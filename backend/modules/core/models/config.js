'use strict';
const CoreModel = require("../../../libs/core/model");
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Config extends CoreModel {

        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }

        getValue() {
            return this.value ? JSON.parse(this.value) : {}
        }
    }

    // enable model cache
    Config.cache = false

    Config.init({
        key: {
            type: 'varchar(50)'
        },
        keyCrc: {
            type: DataTypes.BIGINT(30)
        },
        value: {
            type: 'text'
        }
    }, {
        sequelize,
        tableName: 'g_core_configs',
        modelName: 'Config',
    });

    return Config;
};
