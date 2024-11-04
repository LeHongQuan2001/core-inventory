'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Route extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }

        getMethods() {
            return this.methods ? JSON.parse(this.methods) : []
        }
    }

    Route.init({
        name: DataTypes.STRING,
        route: DataTypes.STRING,
        uri: DataTypes.STRING,
        uriCrc: DataTypes.INTEGER,
        methods: DataTypes.STRING,
        status: DataTypes.INTEGER
    }, {
        sequelize,
        tableName: 'g_core_routes',
        modelName: 'Route',
        timestamps: true
    })
    return Route;
};
