'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('g_core_roles', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER(11)
            },
            name: {
                type: Sequelize.STRING
            },
            status: {
                type: 'tinyint(2)'
            },
            data: {
                type: 'longtext'
            },
            permissionLocked: {
                type: 'tinyint(2)'
            },
            apiPermissions: {
                type: 'longtext'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }, {charset: 'utf8', collate: 'utf8_unicode_ci'});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('g_core_roles');
    }
};
