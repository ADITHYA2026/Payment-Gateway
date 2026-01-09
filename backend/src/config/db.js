const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
  } catch (err) {
    console.error("DB connection failed", err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };