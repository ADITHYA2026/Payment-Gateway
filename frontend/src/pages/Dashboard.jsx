import { useEffect, useState } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    successRate: 0,
    isLoading: true
  });

  const fetchDashboardData = () => {
    setStats(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    setTimeout(() => {
      // Mock data
      const mockPayments = Array.from({ length: 50 }, (_, i) => ({
        id: `pay_${Math.random().toString(36).substr(2, 16)}`,
        amount: Math.floor(Math.random() * 100000) + 10000,
        status: Math.random() > 0.1 ? "success" : "failed",
      }));

      const total = mockPayments.length;
      const success = mockPayments.filter(p => p.status === "success");
      const amount = success.reduce((sum, p) => sum + p.amount, 0);
      const rate = total ? Math.round((success.length / total) * 100) : 0;

      setStats({
        totalTransactions: total,
        totalAmount: amount,
        successRate: rate,
        isLoading: false
      });
    }, 500);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  return (
    <div style={styles.container} data-test-id="dashboard">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Welcome back! Here's your payment gateway overview</p>
        </div>
        
        <button
          onClick={fetchDashboardData}
          style={styles.refreshButton}
        >
          {stats.isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {/* Total Transactions */}
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <h3 style={styles.statTitle}>Total Transactions</h3>
          </div>
          <div style={styles.statValue} data-test-id="total-transactions">
            {stats.isLoading ? "..." : stats.totalTransactions.toLocaleString()}
          </div>
        </div>

        {/* Total Amount */}
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <h3 style={styles.statTitle}>Total Amount Processed</h3>
          </div>
          <div style={styles.statValue} data-test-id="total-amount">
            {stats.isLoading ? "..." : formatCurrency(stats.totalAmount)}
          </div>
        </div>

        {/* Success Rate */}
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <h3 style={styles.statTitle}>Success Rate</h3>
          </div>
          <div style={styles.statValue} data-test-id="success-rate">
            {stats.isLoading ? "..." : `${stats.successRate}%`}
          </div>
        </div>
      </div>

      {/* API Credentials */}
      <div style={styles.mainContent}>
        <div style={styles.card} data-test-id="stats-container">
          <h2 style={styles.cardTitle}>API Credentials</h2>
          <div style={styles.credentials}>
            <div style={styles.credentialGroup}>
              <label style={styles.credentialLabel}>API Key</label>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  readOnly
                  value="key_test_abc123"
                  data-test-id="api-key"
                  style={styles.credentialInput}
                />
                <button 
                  onClick={() => navigator.clipboard.writeText("key_test_abc123")}
                  style={styles.copyButton}
                >
                  Copy
                </button>
              </div>
            </div>

            <div style={styles.credentialGroup}>
              <label style={styles.credentialLabel}>API Secret</label>
              <div style={styles.inputWrapper}>
                <input
                  type="password"
                  readOnly
                  value="secret_test_xyz789"
                  data-test-id="api-secret"
                  style={styles.credentialInput}
                />
                <button 
                  onClick={() => navigator.clipboard.writeText("secret_test_xyz789")}
                  style={styles.copyButton}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Quick Stats</h2>
          <div style={styles.quickStats}>
            <div style={styles.quickStat}>
              <div style={styles.quickStatLabel}>Average Transaction</div>
              <div style={styles.quickStatValue}>₹1,250</div>
            </div>
            <div style={styles.quickStat}>
              <div style={styles.quickStatLabel}>Peak Hour</div>
              <div style={styles.quickStatValue}>14:00-15:00</div>
            </div>
            <div style={styles.quickStat}>
              <div style={styles.quickStatLabel}>Active Merchants</div>
              <div style={styles.quickStatValue}>24</div>
            </div>
            <div style={styles.quickStat}>
              <div style={styles.quickStatLabel}>Refund Rate</div>
              <div style={styles.quickStatValue}>1.2%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
  },
  refreshButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
  },
  statHeader: {
    marginBottom: '16px',
  },
  statTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#111827',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '20px',
  },
  credentials: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  credentialGroup: {
    marginBottom: '16px',
  },
  credentialLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px',
  },
  credentialInput: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#f9fafb',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'monospace',
    outline: 'none',
  },
  inputWrapper: {
    position: 'relative',
  },
  copyButton: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#e5e7eb',
    color: '#374151',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 12px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  quickStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  quickStat: {
    backgroundColor: '#f9fafb',
    padding: '16px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  },
  quickStatLabel: {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '4px',
  },
  quickStatValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
  },
};

export default Dashboard;