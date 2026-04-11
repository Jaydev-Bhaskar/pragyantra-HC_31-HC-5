import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './Pages.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="landing-page">
      <Navbar />
      <section className="landing-header">
        <h1>Contact <span className="highlight">Us</span></h1>
        <p>Have questions? We're here to help you secure your health future.</p>
      </section>


      <section className="contact-container">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="info-item">
              <span className="icon">📍</span>
              <p>123 Digital Health Plaza, Tech City</p>
            </div>
            <div className="info-item">
              <span className="icon">📧</span>
              <p>support@healthvault.ai</p>
            </div>
            <div className="info-item">
              <span className="icon">📞</span>
              <p>+1 (800) HEALTH-0</p>
            </div>
            
            <div className="social-links">
               {/* Add social icons here if desired */}
            </div>
          </div>

          <div className="contact-form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your Name" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea 
                  rows="5" 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="How can we help?" 
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
