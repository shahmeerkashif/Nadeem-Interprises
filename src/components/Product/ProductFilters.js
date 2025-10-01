import React from 'react';
import './ProductFilters.css';

const ProductFilters = ({ filters, setFilters, products }) => {
  const categories = ['Home Decor', 'Ceramics', 'Marbles',];
  
  const handlePriceRangeChange = (e) => {
    const value = parseInt(e.target.value);
    const isMin = e.target.name === 'minPrice';
    
    setFilters(prev => ({
      ...prev,
      priceRange: isMin 
        ? [value, prev.priceRange[1]]
        : [prev.priceRange[0], value]
    }));
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? '' : category
    }));
  };

  const handleStockChange = (e) => {
    setFilters(prev => ({
      ...prev,
      inStock: e.target.checked
    }));
  };

  const handleSortChange = (e) => {
    setFilters(prev => ({
      ...prev,
      sortBy: e.target.value
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      category: '',
      inStock: false,
      sortBy: 'newest'
    });
  };

  return (
    <div className="product-filters">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="clear-filters" onClick={clearFilters}>
          Clear All
        </button>
      </div>

      {/* Price Range Filter */}
      <div className="filter-group">
        <h4>Price Range</h4>
        <div className="price-inputs">
          <div className="price-input">
            <label>Min</label>
            <input
              type="number"
              name="minPrice"
              value={filters.priceRange[0]}
              onChange={handlePriceRangeChange}
              min="0"
              max="10000"
            />
          </div>
          <div className="price-input">
            <label>Max</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.priceRange[1]}
              onChange={handlePriceRangeChange}
              min="0"
              max="10000"
            />
          </div>
        </div>
        <div className="price-range">
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={filters.priceRange[1]}
            onChange={handlePriceRangeChange}
            name="maxPrice"
            className="price-slider"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <h4>Category</h4>
        <div className="category-options">
          {categories.map(category => (
            <label key={category} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.category === category}
                onChange={() => handleCategoryChange(category)}
              />
              <span className="checkmark"></span>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Stock Filter */}
      <div className="filter-group">
        <h4>Availability</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={handleStockChange}
          />
          <span className="checkmark"></span>
          In Stock Only
        </label>
      </div>

      {/* Sort Options */}
      <div className="filter-group">
        <h4>Sort By</h4>
        <select 
          value={filters.sortBy} 
          onChange={handleSortChange}
          className="sort-select"
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;
