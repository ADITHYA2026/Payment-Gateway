import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <svg style={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth="2" />
              <path d="M2 10h20" strokeWidth="2" />
              <circle cx="8" cy="14" r="1" fill="currentColor" />
              <circle cx="12" cy="14" r="1" fill="currentColor" />
            </svg>
          </div>
          <h1 style={styles.title}>Payment Gateway</h1>
          <p style={styles.subtitle}>Merchant Login</p>
        </div>

        <form data-test-id="login-form" onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              data-test-id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="test@example.com"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              data-test-id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter any password"
              required
            />
            <p style={styles.helpText}>
              Demo: test@example.com / any password
            </p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" style={styles.checkbox} />
              Remember me
            </label>
          </div>

          <button
            data-test-id="login-button"
            type="submit"
            style={styles.button}
          >
            Sign In
          </button>
        </form>

        <div style={styles.footer}>
          <div style={styles.demoNote}>
            <strong>Demo Mode:</strong> Use test@example.com with any password
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    backgroundColor: '#f9fafb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '32px',
    border: '1px solid #e5e7eb',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  logoIcon: {
    width: '48px',
    height: '48px',
    color: '#3b82f6',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
  },
  form: {
    marginBottom: '24px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
  },
  helpText: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '8px',
    width: '16px',
    height: '16px',
  },
  button: {
    width: '100%',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonHover: {
    backgroundColor: '#2563eb',
  },
  footer: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '20px',
  },
  demoNote: {
    fontSize: '13px',
    color: '#1e40af',
    backgroundColor: '#eff6ff',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #dbeafe',
  },
};

export default Login;