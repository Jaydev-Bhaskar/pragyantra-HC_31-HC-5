import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Pages.css';

const Home = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <section className="hero-section">
        <div className="hero-content">
          <h1>Your Health, Your Data, <span className="highlight">Your Control</span></h1>
          <p>
            HealthVault uses advanced blockchain technology and AI to secure your medical records and provide personalized healthcare insights.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="primary-btn">Get Started</Link>
            <Link to="/about" className="secondary-btn">Learn More</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070" alt="Healthcare Technology" />
        </div>
      </section>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">⛓️</div>
          <h3>Blockchain Security</h3>
          <p>Your records are encrypted and stored on a decentralized ledger, ensuring they can never be altered or lost.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>AI Diagnostics</h3>
          <p>Leverage state-of-the-art AI to analyze your health trends and provide preventative care suggestions.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔐</div>
          <h3>Full Privacy</h3>
          <p>You decide who sees your data. Grant and revoke access to doctors and hospitals in real-time.</p>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-item">
          <h2>100%</h2>
          <p>Data Sovereignty</p>
        </div>
        <div className="stat-item">
          <h2>256-bit</h2>
          <p>Encryption</p>
        </div>
        <div className="stat-item">
          <h2>Zero</h2>
          <p>Data Leaks</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
