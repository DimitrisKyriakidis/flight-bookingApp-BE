module.exports = (sequelize, Sequelize) => {

    const tableName = 'USERS';
    const Users = sequelize.define(tableName, {
        PK_USER: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        EMAIL: {
            type: Sequelize.STRING,
            allowNull: false
        },
        NAME: {
            type: Sequelize.STRING
        },
        SURNAME: {
            type: Sequelize.STRING,
        },
        PHONE_NUMBER: {
            type: Sequelize.STRING
        },
        CREATED_AT: {
            type: Sequelize.DATE
        },
        UPDATED_AT: {
            type: Sequelize.DATE
        },
        PASSWORD: {
            type: Sequelize.STRING
        },
        ROLE: {
            type: Sequelize.ENUM,
            values: ['Admin', 'Client']
        },
        LAST_MODIFIER: {
            type: Sequelize.STRING
        },
        STATUS: {
            type: Sequelize.ENUM,
            values: ['ACTIVE', 'RESET', 'DISABLED']
        }

    }, {
        freezeTableName: true,
        tableName: tableName,
    });

    Users.seedData = async() => {
        const seedData = require('../seeders/users');
        const dbData = (await Users.findAll({ logging: false })).map(el => el.toJSON().PK_USER);

        const proms = [];
        for (const s of seedData) {
            if (!dbData.includes(s.PK_USER)) {
                proms.push(Users.create(s));
            }
        }
        await Promise.all(proms);
    }

    return Users;
};