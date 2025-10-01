import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { getProduct } from '../services/firebase';
import { useCart } from '../context/CartContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const productData = await getProduct(id);
      setProduct(productData);
    } catch (err) {
      setError('Product not found');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // Show success message or redirect
    alert('Product added to cart!');
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: product?.images?.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: product?.images?.length > 1,
    autoplaySpeed: 3000,
    beforeChange: (current, next) => setSelectedImageIndex(next),
    customPaging: (i) => (
      <div className="custom-dot">
        <img 
          src={product?.images?.[i] || '/placeholder-image.jpg'} 
          alt={`${product?.name} ${i + 1}`}
        />
      </div>
    )
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-page">
        <h2>Product Not Found</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/products')} className="btn">
          Back to Products
        </button>
      </div>
    );
  }

  const displayPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="product-detail">
      <div className="container">
        <motion.div
          className="product-detail-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="product-images">
            <div className="main-image-slider">
              <Slider {...sliderSettings}>
                {product.images?.map((image, index) => (
                  <div key={index} className="slide">
                    <img 
                      src={image || '/placeholder-image.jpg'} 
                      alt={`${product.name} ${index + 1}`}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                )) || (
                  <div className="slide">
                    <img 
                      src="/placeholder-image.jpg" 
                      alt={product.name}
                    />
                  </div>
                )}
              </Slider>
            </div>

            {product.images?.length > 1 && (
              <div className="thumbnail-images">
                {product.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img 
                      src={image || '/placeholder-image.jpg'} 
                      alt={`${product.name} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <div className="product-badges">
              {product.isNewArrival && (
                <span className="badge new">New Arrival</span>
              )}
              {hasDiscount && (
                <span className="badge sale">{discountPercentage}% OFF</span>
              )}
            </div>

            <h1 className="product-title">{product.name}</h1>
            <p className="product-category">{product.category}</p>

            <div className="product-price">
              <span className="current-price">${displayPrice}</span>
              {hasDiscount && (
                <span className="original-price">${product.price}</span>
              )}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || 'No description available.'}</p>
            </div>

            <div className="product-stock">
              {product.stock > 0 ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">✗ Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button 
                  className="add-to-cart-btn btn-primary"
                  onClick={handleAddToCart}
                >
                  Add to Cart - ${(displayPrice * quantity).toFixed(2)}
                </button>
              </div>
            )}

            <div className="product-features">
              <div className="feature">
                <span className="feature-icon">✈️</span>
                <span>Free delivery on orders over $100</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <span>Secure payment</span>
              </div>
              <div className="feature">
                <span className="feature-icon">↩️</span>
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;