import React from 'react';
import './OrderSuccess.css';

const OrderSuccess = () => {
  return (
    <div className="order-success-container">
      {/* Success Icon */}
      <div className="success-icon">✔</div>

      {/* Heading */}
      <h1 className="success-title">Order Placed Successfully!</h1>

      {/* Message */}
      <p className="success-message">
        Thank you for shopping with <strong>Onyx Store</strong>.  
        Your order is being processed and will be shipped soon.
      </p>

      {/* Button */}
      <button className="success-btn" onClick={() => window.location.href = '/'}>
        Go to Home
      </button>
    </div>
  );
};

export default OrderSuccess;
