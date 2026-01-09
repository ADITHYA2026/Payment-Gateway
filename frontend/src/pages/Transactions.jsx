import { useEffect, useState } from "react";

const Transactions = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate mock data
      const mockPayments = Array.from({ length: 50 }, (_, i) => ({
        id: `pay_${Math.random().toString(36).substr(2, 16)}`,
        order_id: `order_${Math.random().toString(36).substr(2, 16)}`,
        amount: Math.floor(Math.random() * 100000) + 10000,
        method: Math.random() > 0.5 ? "upi" : "card",
        status: Math.random() > 0.1 ? "success" : "failed",
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
      }));

      setPayments(mockPayments);
      setIsLoading(false);
    }, 800);
  };

  const filteredPayments = payments.filter(payment => {
    if (statusFilter !== "all" && payment.status !== statusFilter) {
      return false;
    }
    if (searchTerm && !payment.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#10b981';
      case 'failed': return '#ef4444';
      case 'processing': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredPayments.slice(startIndex, endIndex);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Transactions</h1>
          <p style={styles.subtitle}>View and manage all payment transactions</p>
        </div>
        
        <div style={styles.headerActions}>
          <button 
            onClick={fetchTransactions}
            style={styles.refreshButton}
          >
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by Payment ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="processing">Processing</option>
        </select>
      </div>

      {/* Stats Summary */}
      <div style={styles.statsSummary}>
        <div style={styles.statBox}>
          <div style={styles.statLabel}>Total Transactions</div>
          <div style={styles.statValue}>{filteredPayments.length}</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statLabel}>Successful</div>
          <div style={{...styles.statValue, color: '#10b981'}}>
            {filteredPayments.filter(p => p.status === 'success').length}
          </div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statLabel}>Total Amount</div>
          <div style={styles.statValue}>
            {formatCurrency(filteredPayments.reduce((sum, p) => sum + p.amount, 0))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Payment Transactions</h2>
        
        {isLoading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading transactions...</p>
          </div>
        ) : (
          <>
            <div style={styles.tableContainer}>
              <table style={styles.table} data-test-id="transactions-table">
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.tableHeaderCell}>Payment ID</th>
                    <th style={styles.tableHeaderCell}>Order ID</th>
                    <th style={styles.tableHeaderCell}>Amount</th>
                    <th style={styles.tableHeaderCell}>Method</th>
                    <th style={styles.tableHeaderCell}>Status</th>
                    <th style={styles.tableHeaderCell}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((payment) => (
                    <tr 
                      key={payment.id}
                      style={styles.tableRow}
                      data-test-id="transaction-row"
                      data-payment-id={payment.id}
                    >
                      <td style={styles.tableCell}>
                        <span data-test-id="payment-id" style={styles.paymentId}>
                          {payment.id}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span data-test-id="order-id" style={styles.orderId}>
                          {payment.order_id}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span data-test-id="amount" style={styles.amount}>
                          {formatCurrency(payment.amount)}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span data-test-id="method" style={styles.method}>
                          {payment.method.toUpperCase()}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span 
                          data-test-id="status" 
                          style={{
                            ...styles.status,
                            backgroundColor: getStatusColor(payment.status) + '20',
                            color: getStatusColor(payment.status),
                          }}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span data-test-id="created-at" style={styles.createdAt}>
                          {formatDate(payment.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={styles.pageButton}
                >
                  Previous
                </button>
                
                <div style={styles.pageNumbers}>
                  Page {currentPage} of {totalPages}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={styles.pageButton}
                >
                  Next
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredPayments.length === 0 && (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📋</div>
                <h3 style={styles.emptyTitle}>No transactions found</h3>
                <p style={styles.emptyText}>
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your filters or search term'
                    : 'No transactions have been processed yet'}
                </p>
                {(searchTerm || statusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    style={styles.clearButton}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
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
    marginBottom: '24px',
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
  headerActions: {
    display: 'flex',
    gap: '12px',
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
  },
  filters: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
  },
  searchInput: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
  },
  filterSelect: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
    outline: 'none',
  },
  statsSummary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  statBox: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
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
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
  },
  tableHeaderCell: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tableRow: {
    borderBottom: '1px solid #f3f4f6',
  },
  tableRowHover: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    padding: '16px',
    fontSize: '14px',
  },
  paymentId: {
    fontFamily: 'monospace',
    color: '#111827',
  },
  orderId: {
    fontFamily: 'monospace',
    color: '#6b7280',
  },
  amount: {
    fontWeight: '600',
    color: '#111827',
  },
  method: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
  },
  status: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
  },
  createdAt: {
    color: '#6b7280',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb',
  },
  pageButton: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  pageNumbers: {
    fontSize: '14px',
    color: '#6b7280',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #f3f4f6',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '14px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px',
    maxWidth: '400px',
  },
  clearButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default Transactions;