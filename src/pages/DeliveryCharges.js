import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getDeliveryCharges } from '../services/firebase';
import './DeliveryCharges.css';

const DeliveryCharges = () => {
  const [deliveryCharges, setDeliveryCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeliveryCharges();
  }, []);

  const fetchDeliveryCharges = async () => {
    try {
      setLoading(true);
      const charges = await getDeliveryCharges();
      setDeliveryCharges(charges.sort((a, b) => a.city.localeCompare(b.city)));
    } catch (err) {
      setError('Failed to load delivery charges');
      console.error('Error fetching delivery charges:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="delivery-charges-page">
      <div className="container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Delivery Charges</h1>
          <p>Fast and reliable delivery to your doorstep</p>
        </motion.div>

        <motion.div
          className="delivery-info"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="info-cards">
            <div className="info-card">
              <div className="card-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Most orders delivered within 2-5 business days</p>
            </div>
            <div className="info-card">
              <div className="card-icon">📦</div>
              <h3>Secure Packaging</h3>
              <p>Your jewelry is carefully packaged for safe transport</p>
            </div>
            <div className="info-card">
              <div className="card-icon">📍</div>
              <h3>Order Tracking</h3>
              <p>Track your order status from dispatch to delivery</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="charges-table-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>Delivery Charges by City</h2>
          
          {deliveryCharges.length > 0 ? (
            <div className="charges-table">
              <div className="table-header">
                <div className="header-cell">City</div>
                <div className="header-cell">Delivery Charge</div>
                <div className="header-cell">Estimated Time</div>
              </div>
              
              {deliveryCharges.map((charge, index) => (
                <motion.div
                  key={charge.id}
                  className="table-row"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="table-cell city-name">{charge.city}</div>
                  <div className="table-cell charge-amount">
                    {charge.charge === 0 ? 'FREE' : `$${charge.charge}`}
                  </div>
                  <div className="table-cell delivery-time">
                    {charge.estimatedDays || '2-5'} business days
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="no-charges">
              <p>No delivery information available at the moment.</p>
            </div>
          )}
        </motion.div>

        <motion.div
          className="delivery-notes"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3>Important Notes</h3>
          <ul>
            <li>Delivery charges are calculated automatically during checkout</li>
            <li>Free delivery on orders over $100 (terms and conditions apply)</li>
            <li>Remote areas may incur additional charges</li>
            <li>Delivery times may vary during peak seasons and holidays</li>
            <li>We provide insurance coverage for all shipments</li>
            <li>Signature confirmation required for high-value items</li>
          </ul>
        </motion.div>

        <motion.div
          className="contact-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="contact-card">
            <h3>Need Help?</h3>
            <p>If your city is not listed or you have questions about delivery, please contact us:</p>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>support@onyx.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeliveryCharges;
