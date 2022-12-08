// const hash = require("object-hash");

// module.exports = (sequelize, Sequelize) => {
//   const tableName = "SEAT_TYPE";
//   const seatType = sequelize.define(
//     tableName,
//     {
//       id: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         defaultValue: Sequelize.UUIDV4,
//         primaryKey: true,
//       },
//       name: {
//         type: Sequelize.STRING,
//         allowNull: true,
//       },
//       price: {
//         type: Sequelize.INTEGER,
//         allowNull: true,
//       },
//       seat_id: {
//         type: Sequelize.STRING,
//         allowNull: true,
//       },
//     },
//     {
//       freezeTableName: true,
//       tableName: tableName,
//     }
//   );

//   return seatType;
// };
