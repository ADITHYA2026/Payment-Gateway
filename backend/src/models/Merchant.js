const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Merchant = sequelize.define("Merchant", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  api_key: { type: DataTypes.STRING, unique: true },
  api_secret: DataTypes.STRING,
  webhook_url: DataTypes.TEXT,
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: "merchants",
  timestamps: true,
});

module.exports = Merchant;