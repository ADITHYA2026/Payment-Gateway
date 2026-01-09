const router = require("express").Router();
const { sequelize } = require("../config/db");

router.get("/", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(200).json({
      status: "healthy",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;