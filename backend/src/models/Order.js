const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Merchant = require("./Merchant");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.STRING(64),
    primaryKey: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 100 },
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: "INR",
  },
  receipt: DataTypes.STRING(255),
  notes: DataTypes.JSON,
  status: {
    type: DataTypes.STRING(20),
    defaultValue: "created",
  },
}, {
  tableName: "orders",
  timestamps: true,
});

Merchant.hasMany(Order, { foreignKey: "merchant_id" });
Order.belongsTo(Merchant, { foreignKey: "merchant_id" });

module.exports = Order;