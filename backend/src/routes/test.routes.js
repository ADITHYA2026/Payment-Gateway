const router = require("express").Router();
const Merchant = require("../models/Merchant");

router.get("/merchant", async (req, res) => {
  const merchant = await Merchant.findOne({
    where: { email: process.env.TEST_MERCHANT_EMAIL },
  });

  if (!merchant) return res.sendStatus(404);

  res.json({
    id: merchant.id,
    email: merchant.email,
    api_key: merchant.api_key,
    seeded: true,
  });
});

module.exports = router;