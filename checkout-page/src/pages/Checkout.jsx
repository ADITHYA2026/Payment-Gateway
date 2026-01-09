import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Checkout = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");

  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState(null);
  const [payment, setPayment] = useState(null);
  const [status, setStatus] = useState("idle");
  const [vpa, setVpa] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });

  useEffect(() => {
    if (orderId) {
      fetch(`http://localhost:8000/api/v1/orders/${orderId}/public`)
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            setOrder(data);
          }
        });
    }
  }, [orderId]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setStatus("processing");

    let payload = {
      order_id: orderId,
      method: method,
    };

    if (method === "upi") {
      payload.vpa = vpa;
    } else if (method === "card") {
      const [expiryMonth, expiryYear] = cardDetails.expiry.split("/");
      payload.card = {
        number: cardDetails.number.replace(/\s/g, ""),
        expiry_month: expiryMonth,
        expiry_year: expiryYear,
        cvv: cardDetails.cvv,
        holder_name: cardDetails.name
      };
    }

    try {
      const res = await fetch("http://localhost:8000/api/v1/payments/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setPayment(data);
      pollPaymentStatus(data.id);
    } catch (error) {
      setStatus("failed");
    }
  };

  const pollPaymentStatus = (id) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/payments/${id}/public`);
        const paymentData = await res.json();
        
        if (paymentData.status !== "processing") {
          clearInterval(interval);
          setStatus(paymentData.status);
          setPayment(paymentData);
        }
      } catch (error) {
        clearInterval(interval);
        setStatus("failed");
      }
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  if (!order) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading order details...</p>
      </div>
    );
  }

  return (
    <div style={styles.container} data-test-id="checkout-container">
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Complete Your Payment</h1>
        <p style={styles.subtitle}>Order #{orderId}</p>
      </div>

      <div style={styles.mainContent}>
        {/* Order Summary */}
        <div style={styles.orderSummary} data-test-id="order-summary">
          <h2 style={styles.sectionTitle}>Order Summary</h2>
          
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Amount</span>
            <span style={styles.summaryValue} data-test-id="order-amount">
              ₹{(order.amount / 100).toLocaleString('en-IN')}
            </span>
          </div>
          
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Order ID</span>
            <span style={styles.summaryValue} data-test-id="order-id">{order.id}</span>
          </div>
          
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Currency</span>
            <span style={styles.summaryValue}>{order.currency}</span>
          </div>
        </div>

        {/* Payment Section */}
        <div style={styles.paymentSection}>
          {status === "idle" && (
            <>
              {/* Payment Method Selection */}
              <div style={styles.methodSelection} data-test-id="payment-methods">
                <h2 style={styles.sectionTitle}>Select Payment Method</h2>
                <div style={styles.methodButtons}>
                  <button
                    data-test-id="method-upi"
                    onClick={() => setMethod("upi")}
                    style={{
                      ...styles.methodButton,
                      ...(method === "upi" ? styles.methodButtonActive : {})
                    }}
                  >
                    <div style={styles.methodIcon}>📱</div>
                    <div style={styles.methodInfo}>
                      <div style={styles.methodName}>UPI</div>
                      <div style={styles.methodDescription}>Pay using UPI ID</div>
                    </div>
                  </button>

                  <button
                    data-test-id="method-card"
                    onClick={() => setMethod("card")}
                    style={{
                      ...styles.methodButton,
                      ...(method === "card" ? styles.methodButtonActive : {})
                    }}
                  >
                    <div style={styles.methodIcon}>💳</div>
                    <div style={styles.methodInfo}>
                      <div style={styles.methodName}>Credit/Debit Card</div>
                      <div style={styles.methodDescription}>Visa, Mastercard, RuPay, Amex</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* UPI Form */}
              {method === "upi" && (
                <div style={styles.formCard}>
                  <form data-test-id="upi-form" onSubmit={handlePayment}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Enter UPI ID</label>
                      <input
                        data-test-id="vpa-input"
                        type="text"
                        value={vpa}
                        onChange={(e) => setVpa(e.target.value)}
                        placeholder="username@bank"
                        style={styles.formInput}
                        required
                      />
                      <p style={styles.formHelp}>
                        Example: username@okhdfcbank, user@paytm
                      </p>
                    </div>

                    <button
                      data-test-id="pay-button"
                      type="submit"
                      style={styles.submitButton}
                    >
                      Pay ₹{(order.amount / 100).toLocaleString('en-IN')}
                    </button>
                  </form>
                </div>
              )}

              {/* Card Form */}
              {method === "card" && (
                <div style={styles.formCard}>
                  <form data-test-id="card-form" onSubmit={handlePayment}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Card Number</label>
                      <input
                        data-test-id="card-number-input"
                        type="text"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({
                          ...cardDetails,
                          number: formatCardNumber(e.target.value)
                        })}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        style={styles.formInput}
                        required
                      />
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Expiry Date (MM/YY)</label>
                        <input
                          data-test-id="expiry-input"
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({
                            ...cardDetails,
                            expiry: formatExpiry(e.target.value)
                          })}
                          placeholder="MM/YY"
                          maxLength={5}
                          style={styles.formInput}
                          required
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>CVV</label>
                        <input
                          data-test-id="cvv-input"
                          type="password"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({
                            ...cardDetails,
                            cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                          })}
                          placeholder="123"
                          maxLength={4}
                          style={styles.formInput}
                          required
                        />
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Cardholder Name</label>
                      <input
                        data-test-id="cardholder-name-input"
                        type="text"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({
                          ...cardDetails,
                          name: e.target.value
                        })}
                        placeholder="Name on card"
                        style={styles.formInput}
                        required
                      />
                    </div>

                    <button
                      data-test-id="pay-button"
                      type="submit"
                      style={styles.submitButton}
                    >
                      Pay ₹{(order.amount / 100).toLocaleString('en-IN')}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

          {/* Processing State */}
          {status === "processing" && (
            <div style={styles.statusCard} data-test-id="processing-state">
              <div style={styles.processingSpinner}></div>
              <h3 style={styles.statusTitle} data-test-id="processing-message">
                Processing Your Payment
              </h3>
              <p style={styles.statusText}>
                Please wait while we process your payment. This may take a few seconds.
              </p>
            </div>
          )}

          {/* Success State */}
          {status === "success" && payment && (
            <div style={styles.statusCard} data-test-id="success-state">
              <div style={styles.successIcon}>✓</div>
              <h3 style={styles.statusTitle}>Payment Successful!</h3>
              <p style={styles.statusText} data-test-id="success-message">
                Your payment has been processed successfully.
              </p>
              
              <div style={styles.receipt}>
                <div style={styles.receiptRow}>
                  <span style={styles.receiptLabel}>Payment ID</span>
                  <span style={styles.receiptValue} data-test-id="payment-id">
                    {payment.id}
                  </span>
                </div>
                <div style={styles.receiptRow}>
                  <span style={styles.receiptLabel}>Amount Paid</span>
                  <span style={styles.receiptValue}>
                    ₹{(payment.amount / 100).toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={styles.receiptRow}>
                  <span style={styles.receiptLabel}>Method</span>
                  <span style={styles.receiptValue}>{payment.method.toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === "failed" && (
            <div style={styles.statusCard} data-test-id="error-state">
              <div style={styles.errorIcon}>✗</div>
              <h3 style={styles.statusTitle}>Payment Failed</h3>
              <p style={styles.statusText} data-test-id="error-message">
                {payment?.error_description || "Payment could not be processed. Please try again."}
              </p>
              
              <div style={styles.buttonGroup}>
                <button
                  data-test-id="retry-button"
                  onClick={() => {
                    setStatus("idle");
                    setMethod(null);
                  }}
                  style={styles.primaryButton}
                >
                  Try Another Method
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '32px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  loadingContainer: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '16px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  orderSummary: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
  },
  paymentSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '24px',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  summaryLabel: {
    fontSize: '14px',
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
  },
  methodSelection: {
    marginBottom: '32px',
  },
  methodButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  methodButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
  },
  methodButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  methodIcon: {
    fontSize: '32px',
    marginRight: '16px',
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  },
  methodDescription: {
    fontSize: '12px',
    color: '#6b7280',
  },
  formCard: {
    marginTop: '24px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  formLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px',
  },
  formInput: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  formHelp: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  statusCard: {
    textAlign: 'center',
    padding: '40px',
  },
  processingSpinner: {
    width: '60px',
    height: '60px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 24px',
  },
  successIcon: {
    width: '60px',
    height: '60px',
    backgroundColor: '#10b981',
    color: 'white',
    borderRadius: '50%',
    fontSize: '32px',
    lineHeight: '60px',
    margin: '0 auto 24px',
  },
  errorIcon: {
    width: '60px',
    height: '60px',
    backgroundColor: '#ef4444',
    color: 'white',
    borderRadius: '50%',
    fontSize: '32px',
    lineHeight: '60px',
    margin: '0 auto 24px',
  },
  statusTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '12px',
  },
  statusText: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '32px',
    maxWidth: '500px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  receipt: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '32px',
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  receiptRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #e5e7eb',
  },
  receiptRowLast: {
    borderBottom: 'none',
  },
  receiptLabel: {
    fontSize: '14px',
    color: '#6b7280',
  },
  receiptValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

// Add CSS animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default Checkout;