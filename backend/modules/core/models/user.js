'use strict';
const CoreModel = require("../../../libs/core/model");
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends CoreModel {

        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.User.belongsTo(models.Role, {
                targetKey: 'id',
                foreignKey: 'roleId',
                constraints: false
            })

        }

        getExt(field = null) {
            const ext = this.ext ? JSON.parse(this.ext) : {};
            return !field ? ext : (ext && typeof ext[field] !== 'undefined' ? ext[field] : false);
        }
    }

    // enable model cache
    User.cache = true;

    User.STATUS_SUSPEND = -1;
    User.STATUS_ACTIVE = 1;

    User.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        fullName: DataTypes.STRING,
        avatar: DataTypes.STRING,
        mobile: DataTypes.STRING,
        roleId: DataTypes.INTEGER,
        data: DataTypes.JSON,
        status: DataTypes.INTEGER,
        extraPermission: DataTypes.TEXT,
        ext: DataTypes.TEXT,
        permissionLocked: DataTypes.INTEGER
    }, {
        sequelize,
        tableName: 'g_core_users',
        modelName: 'User',
        timestamps: true
    });

    return User;
};
