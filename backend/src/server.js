require("dotenv").config();
const app = require("./app");
const { connectDB, sequelize } = require("./config/db");
const { seedTestMerchant } = require("./services/seed.service");

const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await connectDB();
    await sequelize.sync();
    await seedTestMerchant();

    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start", err);
    process.exit(1);
  }
})();