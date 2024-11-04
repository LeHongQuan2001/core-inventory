'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('g_core_users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: true
            },
            fullName: {
                type: Sequelize.STRING,
                allowNull: true
            },
            avatar: {
                type: Sequelize.STRING,
                allowNull: true
            },
            mobile: {
                type: Sequelize.STRING,
                allowNull: true
            },
            roleId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            data: {
                type: Sequelize.JSON,
            },
            status: {
                type: 'tinyint(2)'
            },
            extraPermission: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            ext: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            permissionLocked: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }, {charset: 'utf8', collate: 'utf8_unicode_ci'})
            .then(() => {
                return queryInterface.addConstraint('g_core_users', {
                    type: 'FOREIGN KEY',
                    fields: ['roleId'],
                    name: 'fk_user_role',
                    references: { //Required fields
                        table: 'g_core_roles',
                        field: 'id'
                    },
                    onDelete: 'NO ACTION',
                    onUpdate: 'NO ACTION'
                })
            }).then(() => {
                return queryInterface.addIndex('g_core_users', {
                    name: 'idx_user_role',
                    fields: ['id', 'roleId'],
                    unique: false
                })
            })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint('g_core_users', 'fk_user_role')
        await queryInterface.dropTable('g_core_users');
    }
};
