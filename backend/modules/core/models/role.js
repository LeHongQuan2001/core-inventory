'use strict';
const CoreModel = require("../../../libs/core/model");
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Role extends CoreModel {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }

        getData() {
            return this.data ? JSON.parse(this.data) : {}
        }
    }

    // enable model cache
    Role.cache = true
    Role.ROLE_DEFAULT = -1;
    Role.ROLE_USER = 3;

    Role.init({
        id: {
            field: 'id',
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: DataTypes.STRING,
        status: DataTypes.INTEGER,
        data: DataTypes.TEXT,
        permissionLocked: DataTypes.INTEGER,
        apiPermissions: DataTypes.TEXT
    }, {
        sequelize,
        tableName: 'g_core_roles',
        modelName: 'Role',
        timestamps: true
    });
    return Role;
};
