import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { demoUser } from '../utils/demoData';
import API from '../utils/api';
import { FiArrowLeft } from 'react-icons/fi';
import './Auth.css';

const Login = () => {
  const [mode, setMode] = useState('email'); // 'email' or 'aadhaar'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [aadhaarId, setAadhaarId] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await API.post('/auth/login', { email, password });
      login(data); navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (aadhaarId.length !== 12) { setError('Aadhaar must be 12 digits'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await API.post('/auth/aadhaar/send-otp', { aadhaarId });
      setOtpSent(true);
      setDemoOtp(data.demoOtp);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await API.post('/auth/aadhaar/verify-otp', { aadhaarId, otp });
      login(data); navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
    setLoading(false);
  };

  const handleDemoLogin = () => { login(demoUser); navigate('/dashboard'); };

  return (
    <div className="auth-page centered">
      <div className="auth-card card">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '16px', fontSize: '0.9rem', fontWeight: '500' }}>
            <FiArrowLeft /> Back to Home
          </Link>
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to access your health dashboard</p>

          {/* Mode Toggle */}
          <div className="auth-mode-toggle">
            <button className={`mode-btn ${mode === 'email' ? 'active' : ''}`} onClick={() => { setMode('email'); setError(''); setOtpSent(false); }}>
              📧 Email Login
            </button>
            <button className={`mode-btn ${mode === 'aadhaar' ? 'active' : ''}`} onClick={() => { setMode('aadhaar'); setError(''); }}>
              🪪 Aadhaar OTP
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {mode === 'email' ? (
            <form onSubmit={handleEmailLogin}>
              <div className="form-group"><label>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="aryan@example.com" required />
              </div>
              <div className="form-group"><label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              <button type="submit" className="btn-primary auth-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <>
              <div className="form-group"><label>Aadhaar Number (12 digits)</label>
                <input type="text" value={aadhaarId} onChange={(e) => setAadhaarId(e.target.value.replace(/\D/g, '').slice(0, 12))} placeholder="XXXX XXXX XXXX" maxLength={12} />
              </div>
              {!otpSent ? (
                <button className="btn-primary auth-btn" onClick={handleSendOtp} disabled={loading || aadhaarId.length !== 12}>
                  {loading ? 'Sending OTP...' : '📱 Send OTP'}
                </button>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  {demoOtp && (
                    <div className="otp-demo-hint">
                      🎯 Demo OTP: <strong>{demoOtp}</strong> <span className="text-muted">(auto-shown for hackathon demo)</span>
                    </div>
                  )}
                  <div className="form-group"><label>Enter OTP</label>
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit OTP" maxLength={6} required />
                  </div>
                  <button type="submit" className="btn-primary auth-btn" disabled={loading || otp.length !== 6}>
                    {loading ? 'Verifying...' : '✅ Verify & Login'}
                  </button>
                  <button type="button" className="btn-ghost auth-btn" onClick={() => { setOtpSent(false); setOtp(''); }} style={{ marginTop: '8px' }}>
                    Resend OTP
                  </button>
                </form>
              )}
            </>
          )}

          <div className="auth-divider"><span>or</span></div>
          <button className="btn-secondary auth-btn" onClick={handleDemoLogin}>🚀 Quick Demo Login</button>
          <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
};


export default Login;
