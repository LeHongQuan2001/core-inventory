'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('g_core_rules', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            objectId: {
                type: Sequelize.INTEGER
            },
            objectType: {
                type: 'char(50)'
            },
            routeId: {
                type: Sequelize.INTEGER
            },
            allow: {
                type: 'tinyint(2)'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }, {charset: 'utf8', collate: 'utf8_unicode_ci'}).then(() => {
            return queryInterface.addIndex('g_core_rules', {
                name: 'idx_object',
                fields: ['objectId', 'objectType'],
                unique: false
            });
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('g_core_rules');
    }
};
