'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('g_core_routes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            route: {
                type: Sequelize.STRING
            },
            uri: {
                type: Sequelize.STRING
            },
            uriCrc: {
                type: 'bigint(30)'
            },
            methods: {
                type: Sequelize.STRING
            },
            status: {
                type: 'tinyint(2)'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        }, {charset: 'utf8', collate: 'utf8_unicode_ci'}).then(() => {
            return queryInterface.addIndex('g_core_routes', {
                name: 'idx_route_status',
                fields: ['uriCrc', 'status'],
                unique: false
            })
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('g_core_routes');
    }
};
