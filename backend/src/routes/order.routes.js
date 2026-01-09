const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const Order = require("../models/Order");
const { generateId } = require("../utils/idGenerator");

router.post("/", auth, async (req, res) => {
  const { amount, currency, receipt, notes } = req.body;

  if (!amount || amount < 100) {
    return res.status(400).json({
      error: {
        code: "BAD_REQUEST_ERROR",
        description: "amount must be at least 100",
      },
    });
  }

  const order = await Order.create({
    id: generateId("order_"),
    merchant_id: req.merchant.id,
    amount,
    currency: currency || "INR",
    receipt,
    notes,
  });

  res.status(201).json(order);
});

router.get("/:id/public", async (req, res) => {
  const order = await Order.findOne({
    where: { id: req.params.id },
    attributes: ["id", "amount", "currency", "status"],
  });

  if (!order) {
    return res.status(404).json({
      error: { code: "NOT_FOUND_ERROR", description: "Order not found" },
    });
  }

  res.json(order);
});

module.exports = router;