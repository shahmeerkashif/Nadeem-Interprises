import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const displayPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <motion.div 
      className="product-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image">
          <img 
            src={product.images?.[0] || '/placeholder-image.jpg'} 
            alt={product.name}
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
          {product.isNewArrival && (
            <span className="product-badge new">New</span>
          )}
          {hasDiscount && (
            <span className="product-badge sale">Sale</span>
          )}
          {product.stock === 0 && (
            <span className="product-badge out-of-stock">Out of Stock</span>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          {/* <p className="product-category">{product.category}</p> */}
          
          <div className="product-price">
            {hasDiscount ? (
              <>
                <span className="current-price">Rs: {displayPrice}</span>
                <span className="original-price">Rs: {product.price}</span>
              </>
            ) : (
              <span className="current-price">Rs: {displayPrice}</span>
            )}
          </div>
          
          {product.stock > 0 ? (
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          ) : (
            <button className="add-to-cart-btn disabled" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
