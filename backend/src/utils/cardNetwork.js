const detectNetwork = (number) => {
  const n = number.replace(/[\s-]/g, "");

  if (n.startsWith("4")) return "visa";

  const first2 = parseInt(n.substring(0, 2));
  if (first2 >= 51 && first2 <= 55) return "mastercard";
  if (first2 === 34 || first2 === 37) return "amex";
  if (n.startsWith("60") || n.startsWith("65") || (first2 >= 81 && first2 <= 89))
    return "rupay";

  return "unknown";
};

module.exports = { detectNetwork };