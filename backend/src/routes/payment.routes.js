const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const Order = require("../models/Order");
const Payment = require("../models/Payment");

const { generateId } = require("../utils/idGenerator");
const { validateVPA } = require("../utils/vpa");
const { validateLuhn } = require("../utils/luhn");
const { detectNetwork } = require("../utils/cardNetwork");
const { validateExpiry } = require("../utils/expiry");
const { processPayment } = require("../services/payment.service");

/**
 * GET /api/v1/payments
 * Dashboard: list all payments (AUTH)
 */
router.get("/", auth, async (req, res) => {
  const payments = await Payment.findAll({
    where: { merchant_id: req.merchant.id },
    order: [["createdAt", "DESC"]],
  });
  res.json(payments);
});

/**
 * POST /api/v1/payments
 * Merchant payment creation (AUTH)
 */
router.post("/", auth, async (req, res) => {
  const { order_id, method, vpa, card } = req.body;

  const order = await Order.findOne({
    where: { id: order_id, merchant_id: req.merchant.id },
  });

  if (!order) {
    return res.status(404).json({
      error: { code: "NOT_FOUND_ERROR", description: "Order not found" },
    });
  }

  const paymentData = {
    id: generateId("pay_"),
    order_id: order.id,
    merchant_id: req.merchant.id,
    amount: order.amount,
    currency: order.currency,
    method,
    status: "processing",
  };

  if (method === "upi") {
    if (!validateVPA(vpa)) {
      return res.status(400).json({
        error: { code: "INVALID_VPA", description: "Invalid VPA format" },
      });
    }
    paymentData.vpa = vpa;
  }

  if (method === "card") {
    const { number, expiry_month, expiry_year } = card || {};

    if (!validateLuhn(number)) {
      return res.status(400).json({
        error: { code: "INVALID_CARD", description: "Card validation failed" },
      });
    }

    if (!validateExpiry(expiry_month, expiry_year)) {
      return res.status(400).json({
        error: { code: "EXPIRED_CARD", description: "Card expired" },
      });
    }

    paymentData.card_network = detectNetwork(number);
    paymentData.card_last4 = number.slice(-4);
  }

  const payment = await Payment.create(paymentData);
  const success = await processPayment(method);

  if (success) {
    payment.status = "success";
  } else {
    payment.status = "failed";
    payment.error_code = "PAYMENT_FAILED";
    payment.error_description = "Payment processing failed";
  }

  await payment.save();
  res.status(201).json(payment);
});

/**
 * POST /api/v1/payments/public
 * Checkout: create payment (NO AUTH)
 */
router.post("/public", async (req, res) => {
  const { order_id, method, vpa, card } = req.body;

  const order = await Order.findOne({ where: { id: order_id } });
  if (!order) {
    return res.status(404).json({
      error: { code: "NOT_FOUND_ERROR", description: "Order not found" },
    });
  }

  const paymentData = {
    id: generateId("pay_"),
    order_id: order.id,
    merchant_id: order.merchant_id,
    amount: order.amount,
    currency: order.currency,
    method,
    status: "processing",
  };

  if (method === "upi") {
    if (!validateVPA(vpa)) {
      return res.status(400).json({
        error: { code: "INVALID_VPA", description: "Invalid VPA format" },
      });
    }
    paymentData.vpa = vpa;
  }

  if (method === "card") {
    const { number, expiry_month, expiry_year } = card || {};

    if (!validateLuhn(number)) {
      return res.status(400).json({
        error: { code: "INVALID_CARD", description: "Card validation failed" },
      });
    }

    if (!validateExpiry(expiry_month, expiry_year)) {
      return res.status(400).json({
        error: { code: "EXPIRED_CARD", description: "Card expired" },
      });
    }

    paymentData.card_network = detectNetwork(number);
    paymentData.card_last4 = number.slice(-4);
  }

  const payment = await Payment.create(paymentData);
  const success = await processPayment(method);

  if (success) {
    payment.status = "success";
  } else {
    payment.status = "failed";
    payment.error_code = "PAYMENT_FAILED";
    payment.error_description = "Payment processing failed";
  }

  await payment.save();
  res.status(201).json(payment);
});

/**
 * GET /api/v1/payments/:id/public
 * Checkout polling (NO AUTH)
 */
router.get("/:id/public", async (req, res) => {
  const payment = await Payment.findOne({
    where: { id: req.params.id },
  });

  if (!payment) {
    return res.status(404).json({
      error: { code: "NOT_FOUND_ERROR", description: "Payment not found" },
    });
  }

  res.json(payment);
});

/**
 * GET /api/v1/payments/:id
 * Merchant fetch single payment (AUTH)
 */
router.get("/:id", auth, async (req, res) => {
  const payment = await Payment.findOne({
    where: { id: req.params.id, merchant_id: req.merchant.id },
  });

  if (!payment) {
    return res.status(404).json({
      error: { code: "NOT_FOUND_ERROR", description: "Payment not found" },
    });
  }

  res.json(payment);
});

module.exports = router;