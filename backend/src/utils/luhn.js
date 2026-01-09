const validateLuhn = (number) => {
  const cleaned = number.replace(/[\s-]/g, "");
  if (!/^\d{13,19}$/.test(cleaned)) return false;

  let sum = 0;
  let doubleDigit = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    doubleDigit = !doubleDigit;
  }

  return sum % 10 === 0;
};

module.exports = { validateLuhn };