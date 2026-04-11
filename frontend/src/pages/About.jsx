import React from 'react';
import Navbar from '../components/Navbar';
import './Pages.css';

const About = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <div style={{ paddingTop: '60px' }}></div>

      <section className="about-content">
        <div className="about-grid">
          <div className="about-text">
            <h2>Our Mission</h2>
            <p>
              At HealthVault, we believe that every individual should have absolute ownership of their medical history. 
              The current healthcare system is fragmented, with data siloed across multiple institutions. 
              Our mission is to unify these records into a secure, patient-centric ecosystem.
            </p>
            <h2>How It Works</h2>
            <p>
              By leveraging blockchain technology, we create an immutable audit trail of your health records. 
              When a doctor adds a prescription or a lab uploads a report, it's cryptographically signed and 
              stored. Only you, the patient, hold the keys to unlock and share this information.
            </p>
          </div>
          <div className="about-image">
             <img src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=2070" alt="Medical Technology" />
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="value-card">
          <h3>Integrity</h3>
          <p>We ensure data remains untampered and authentic at all times.</p>
        </div>
        <div className="value-card">
          <h3>Accessibility</h3>
          <p>Your records are available to you anywhere in the world, 24/7.</p>
        </div>
        <div className="value-card">
          <h3>Innovation</h3>
          <p>Constantly integrating the latest in AI and Web3 to improve care.</p>
        </div>
      </section>
    </div>
  );
};

export default About;
