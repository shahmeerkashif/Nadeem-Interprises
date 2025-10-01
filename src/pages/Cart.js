import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import './Cart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <motion.div
            className="empty-cart"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="empty-cart-icon">
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
            </div>
            <h2>Your cart is empty</h2>
            <p>Add some beautiful jewelry pieces to your cart</p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <motion.div
          className="cart-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Shopping Cart</h1>
          <button onClick={clearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </motion.div>

        <div className="cart-content">
          <motion.div
            className="cart-items"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {cartItems.map((item, index) => {
              const displayPrice = item.salePrice || item.price;
              const itemTotal = displayPrice * item.quantity;

              return (
                <motion.div
                  key={`${item.id}-${index}`}
                  className="cart-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="item-image">
                    <img 
                      src={item.images?.[0] || '/placeholder-image.jpg'} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>

                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-category">{item.category}</p>
                    <div className="item-price">
                      <span className="current-price">${displayPrice}</span>
                      {item.salePrice && item.salePrice < item.price && (
                        <span className="original-price">${item.price}</span>
                      )}
                    </div>
                  </div>

                  <div className="item-quantity">
                    <label>Quantity:</label>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= (item.stock || 99)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="item-total">
                    <span className="total-price">${itemTotal.toFixed(2)}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="cart-summary"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>

              <button 
                onClick={handleCheckout}
                className="checkout-btn btn-primary"
              >
                Proceed to Checkout
              </button>

              <Link to="/products" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
