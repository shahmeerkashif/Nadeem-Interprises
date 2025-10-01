import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProducts } from '../services/firebase';
import ProductCard from '../components/Product/ProductCard';
import './Homepage.css';
import newArrival from '../assets/c1ec8217-08d4-4fda-a36d-8b09f27c142e.png';
import VideoBanner from '../components/Layout/VideoBanner';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Craft from '../components/craft';

const Homepage = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [salesProducts, setSalesProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [newArrivalsData, salesData, allProductsData] = await Promise.all([
        getProducts({ isNewArrival: true, limit: 6 }),
        getProducts({ isOnSale: true, limit: 6 }),
        getProducts({ limit: 10 })
      ]);

      setNewArrivals(newArrivalsData);
      setSalesProducts(salesData);
      setAllProducts(allProductsData);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
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

  // Responsive slider settings
  const sliderSettings = {
    dots: true,
    infinite: allProducts.length > 1,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 }
      },
      {
        breakpoint: 480,
        settings: { 
          slidesToShow: 1,
          arrows: false
        }
      }
    ]
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">ONYX</h1>
            <p className='p-t'>Exquisite Handicrafts for Every Occasion</p>
            <p className='p-c'>Discover our curated collection of premium Handicrafts featuring Light Green onyx, Pink onyx and precious stones crafted with unparalleled elegance.</p>
            <div className="bt">
              <Link to="/new-arrivals" className="btn1 btn-primary1">
                Shop New Arrivals
              </Link>
              <Link to="/sales" className="btn2 btn-primary2">
                Shop Sales
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <motion.section
          className="section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container">
            <div className="section-header">
              <h2>New Arrivals</h2>
              <span className="section-subtitle">Discover our latest collection of exquisite Onyx pieces</span>
            </div>

            <div className="products-grid">
              {newArrivals.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
            <Link to="/new-arrivals" className="view-all-btn">
              View All New Arrivals
            </Link>
          </div>
        </motion.section>
      )}

      <Craft/>
      
      {/* Sales Section */}
      {salesProducts.length > 0 && (
        <motion.section
          className="section sales-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container">
            <div className="section-header">
              <h2>Special Offers</h2>
              <Link to="/sales" className="section-link">
                View All Sales
              </Link>
            </div>

            <div className="products-grid">
              {salesProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Features Section */}
      <motion.section
        className="features"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">✧</div>
              <h3>Premium Quality</h3>
              <p>Exquisite craftsmanship with attention to every detail</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">♻</div>
              <h3>Sustainable</h3>
              <p>Ethically sourced materials for conscious luxury</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">✉</div>
              <h3>Free Shipping</h3>
              <p>Complimentary delivery on all orders</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Homepage;