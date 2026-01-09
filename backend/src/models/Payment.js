const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Order = require("./Order");
const Merchant = require("./Merchant");

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.STRING(64),
    primaryKey: true,
  },
  amount: DataTypes.INTEGER,
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: "INR",
  },
  method: DataTypes.STRING(20),
  status: {
    type: DataTypes.STRING(20),
    defaultValue: "processing",
  },
  vpa: DataTypes.STRING(255),
  card_network: DataTypes.STRING(20),
  card_last4: DataTypes.STRING(4),
  error_code: DataTypes.STRING(50),
  error_description: DataTypes.TEXT,
}, {
  tableName: "payments",
  timestamps: true,
});

Order.hasMany(Payment, { foreignKey: "order_id" });
Payment.belongsTo(Order, { foreignKey: "order_id" });

Merchant.hasMany(Payment, { foreignKey: "merchant_id" });
Payment.belongsTo(Merchant, { foreignKey: "merchant_id" });

module.exports = Payment;