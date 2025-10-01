import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProducts } from '../services/firebase';
import ProductCard from '../components/Product/ProductCard';
import ProductFilters from '../components/Product/ProductFilters';
import './ProductListing.css';

const ProductListing = ({ type }) => {
  const { category } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    category: '',
    inStock: false,
    sortBy: 'newest'
  });

  const productsPerPage = 12;

  useEffect(() => {
    fetchProducts();
  }, [category, type]);

  useEffect(() => {
    // Get search query from URL
    const urlParams = new URLSearchParams(location.search);
    const search = urlParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  useEffect(() => {
    applyFilters();
  }, [products, filters, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let queryFilters = {};

      if (category) {
        queryFilters.category = category;
      }

      if (type === 'new-arrivals') {
        queryFilters.isNewArrival = true;
      } else if (type === 'sales') {
        queryFilters.isOnSale = true;
      }

      const productsData = await getProducts(queryFilters);
      setProducts(productsData);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(product => {
      const price = product.salePrice || product.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const getPageTitle = () => {
    if (type === 'new-arrivals') return 'New Arrivals';
    if (type === 'sales') return 'Special Offers';
    if (category) return category.charAt(0).toUpperCase() + category.slice(1);
    return 'All Products';
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="product-listing">
      <div className="container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>{getPageTitle()}</h1>
          <p>
            {searchQuery ? `Search results for "${searchQuery}": ` : ''}
            {filteredProducts.length} products found
          </p>
        </motion.div>

        <div className={`listing-content ${category ? 'no-filters' : ''}`}>
          {/* Filters only visible on /products (no category) */}
          {!category && (
            <motion.aside
              className="filters-sidebar"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ProductFilters
                filters={filters}
                setFilters={setFilters}
                products={products}
              />
            </motion.aside>
          )}

          <motion.main
            className="products-main"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {currentProducts.length > 0 ? (
              <>
                <div className="products-grid">
                  {currentProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search criteria</p>
              </div>
            )}
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;

