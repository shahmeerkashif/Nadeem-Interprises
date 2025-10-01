import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Navbar.css";

import Logo from "../../assets/cf617271-316c-4b18-8c51-8b6b9801947d-removebg-preview.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faSearch,
  faTimes,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getCartItemsCount } = useCart();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "New Arrivals", path: "/new-arrivals" },
    { name: "Sales", path: "/sales" },
    { name: "All Products", path: "/products" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setIsMenuOpen(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Brand */}
          <Link to="/" className="navbar-brand">
            <img src={Logo} alt="Logo" />
          </Link>

          {/* Menu */}
          <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
            <div className="navbar-links">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`navbar-link ${
                    isActive(link.path) ? "active" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            {/* Search */}
            <button
              className="search-toggle"
              onClick={toggleSearch}
              aria-label="Toggle search"
            >
              <FontAwesomeIcon
                icon={isSearchOpen ? faTimes : faSearch}
                size="lg"
              />
            </button>

            {/* Cart */}
            <Link to="/cart" className="cart-link">
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              {getCartItemsCount() > 0 && (
                <span className="cart-count">{getCartItemsCount()}</span>
              )}
            </Link>

            {/* Menu Toggle (Mobile) */}
            <button
              className="menu-toggle"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="search-bar-container">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              autoFocus
            />
            <button type="submit" className="search-submit">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
