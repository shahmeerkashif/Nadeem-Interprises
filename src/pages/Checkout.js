import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { getDeliveryCharges, createOrder } from '../services/firebase';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [deliveryCharges, setDeliveryCharges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    fetchDeliveryCharges();
  }, [cartItems, navigate]);

  const fetchDeliveryCharges = async () => {
    try {
      const charges = await getDeliveryCharges();
      setDeliveryCharges(charges);
    } catch (err) {
      console.error('Error fetching delivery charges:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getDeliveryCharge = () => {
    const selectedCity = deliveryCharges.find(
      charge => charge.city.toLowerCase() === formData.city.toLowerCase()
    );
    return selectedCity ? selectedCity.charge : 0;
  };

  const validateForm = () => {
    const required = ['name', 'email', 'phone', 'address', 'city'];
    for (let field of required) {
      if (!formData[field].trim()) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerInfo: formData,
        items: cartItems,
        subtotal: getCartTotal(),
        deliveryCharge: getDeliveryCharge(),
        total: getCartTotal() + getDeliveryCharge(),
        orderDate: new Date().toISOString()
      };

      const orderId = await createOrder(orderData);
      clearCart();
      navigate('/order-success', { state: { orderId } });
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error('Error creating order:', err);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const deliveryCharge = getDeliveryCharge();
  const total = subtotal + deliveryCharge;

  return (
    <div className="checkout-page">
      <div className="container">
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Checkout
        </motion.h1>

        <div className="checkout-content">
          <motion.div
            className="checkout-form"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Delivery Address</h3>
                <div className="form-group">
                  <label htmlFor="address">Street Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select City</option>
                      {deliveryCharges.map(charge => (
                        <option key={charge.id} value={charge.city}>
                          {charge.city} (${charge.charge} delivery)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Additional Notes</h3>
                <div className="form-group">
                  <label htmlFor="notes">Order Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any special instructions for your order..."
                  />
                </div>
              </div>

              {error && <div className="error">{error}</div>}

              <button 
                type="submit" 
                className="place-order-btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
              </button>
            </form>
          </motion.div>

          <motion.div
            className="order-summary"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="order-items">
                {cartItems.map((item, index) => {
                  const displayPrice = item.salePrice || item.price;
                  return (
                    <div key={`${item.id}-${index}`} className="order-item">
                      <div className="item-image">
                        <img 
                          src={item.images?.[0] || '/placeholder-image.jpg'} 
                          alt={item.name}
                        />
                      </div>
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>Qty: {item.quantity}</p>
                        <span className="item-price">${(displayPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="summary-calculations">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery:</span>
                  <span>${deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
