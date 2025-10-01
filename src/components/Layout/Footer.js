import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ONYX</h3>
            <p>Premium jewelry crafted with excellence and elegance.</p>
          </div>

          <div className="footer-section">
            <h4>Categories</h4>
            <ul>
            <li><Link to="/category/Ceramics">Ceramics</Link></li>
<li><Link to="/category/Home Décor">Home Décor</Link></li>
<li><Link to="/category/Marbles">Marbles</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/new-arrivals">New Arrivals</Link></li>
              <li><Link to="/sales">Sales</Link></li>
              <li><Link to="/delivery-charges">Delivery Charges</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>Email: info@onyx.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Jewelry Street, City, State 12345</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Onyx. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
