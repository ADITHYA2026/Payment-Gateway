const processPayment = async (method) => {
  const testMode = process.env.TEST_MODE === "true";

  let delay = Math.floor(
    Math.random() * (10000 - 5000 + 1) + 5000
  );

  let successRate = method === "upi" ? 0.9 : 0.95;
  let success = Math.random() < successRate;

  if (testMode) {
    delay = parseInt(process.env.TEST_PROCESSING_DELAY || 1000);
    success = process.env.TEST_PAYMENT_SUCCESS !== "false";
  }

  await new Promise((res) => setTimeout(res, delay));

  return success;
};

module.exports = { processPayment };