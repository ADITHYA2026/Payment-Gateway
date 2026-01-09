const Merchant = require("../models/Merchant");

module.exports = async (req, res, next) => {
  const apiKey = req.header("X-Api-Key");
  const apiSecret = req.header("X-Api-Secret");

  if (!apiKey || !apiSecret) {
    return res.status(401).json({
      error: {
        code: "AUTHENTICATION_ERROR",
        description: "Invalid API credentials",
      },
    });
  }

  const merchant = await Merchant.findOne({
    where: { api_key: apiKey, api_secret: apiSecret },
  });

  if (!merchant) {
    return res.status(401).json({
      error: {
        code: "AUTHENTICATION_ERROR",
        description: "Invalid API credentials",
      },
    });
  }

  req.merchant = merchant;
  next();
};