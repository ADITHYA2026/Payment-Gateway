const Merchant = require("../models/Merchant");

const seedTestMerchant = async () => {
  const existing = await Merchant.findOne({
    where: { email: process.env.TEST_MERCHANT_EMAIL },
  });

  if (existing) return;

  await Merchant.create({
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Test Merchant",
    email: process.env.TEST_MERCHANT_EMAIL,
    api_key: process.env.TEST_API_KEY,
    api_secret: process.env.TEST_API_SECRET,
  });

  console.log("Test merchant seeded");
};

module.exports = { seedTestMerchant };