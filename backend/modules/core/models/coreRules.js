'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CoreRule extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // define association here
            this.belongsTo(models.Route, {
                targetKey: 'id',
                foreignKey: 'routeId',
                constraints: false
            })
        }
    }
    CoreRule.init({
        objectId: DataTypes.INTEGER,
        objectType: DataTypes.STRING,
        routeId: DataTypes.INTEGER,
        allow: DataTypes.INTEGER
    }, {
        sequelize,
        tableName: 'g_core_rules',
        modelName: 'CoreRule',
        timestamps: true
    });
    return CoreRule;
};
