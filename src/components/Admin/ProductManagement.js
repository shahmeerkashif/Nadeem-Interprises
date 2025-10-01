"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getProducts, addProduct, updateProduct, deleteProduct } from "../../services/firebase"
import "./AdminComponents.css"

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    category: "rings",
    stock: "",
    images: [""],
    isNewArrival: false,
    isOnSale: false,
  })

  const categories = ["Ceramics", "Home Décor", "Marbles"]

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const productsData = await getProducts()
      setProducts(productsData)
    } catch (err) {
      setError("Failed to load products")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }))
  }

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }))
  }

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      images: newImages.length > 0 ? newImages : [""],
    }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      salePrice: "",
      category: "Ceramics",
      stock: "",
      images: [""],
      isNewArrival: false,
      isOnSale: false,
    })
    setEditingProduct(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        salePrice: formData.salePrice ? Number.parseFloat(formData.salePrice) : null,
        stock: Number.parseInt(formData.stock),
        images: formData.images.filter((img) => img.trim() !== ""),
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
      } else {
        await addProduct(productData)
      }

      await fetchProducts()
      resetForm()
    } catch (err) {
      setError("Failed to save product")
      console.error("Error saving product:", err)
    }
  }

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      salePrice: product.salePrice ? product.salePrice.toString() : "",
      category: product.category,
      stock: product.stock.toString(),
      images: product.images?.length > 0 ? product.images : [""],
      isNewArrival: product.isNewArrival || false,
      isOnSale: product.isOnSale || false,
    })
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId)
        await fetchProducts()
      } catch (err) {
        setError("Failed to delete product")
        console.error("Error deleting product:", err)
      }
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Product Management</h2>
        <button onClick={() => setShowForm(true)} className="admin-btn primary">
          + Add Product
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <motion.div className="admin-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={resetForm} className="modal-close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="name">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="category">Category *</label>
                  <select id="category" name="category" value={formData.category} onChange={handleInputChange} required>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="price">Price *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="salePrice">Sale Price</label>
                  <input
                    type="number"
                    id="salePrice"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Product Images (URLs)</label>
                {formData.images.map((image, index) => (
                  <div key={index} className="image-input-row">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="Enter image URL"
                    />
                    {formData.images.length > 1 && (
                      <button type="button" onClick={() => removeImageField(index)} className="admin-btn danger small">
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addImageField} className="admin-btn">
                  + Add Image
                </button>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isNewArrival"
                      checked={formData.isNewArrival}
                      onChange={handleInputChange}
                    />
                    New Arrival
                  </label>
                </div>
                <div className="admin-form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" name="isOnSale" checked={formData.isOnSale} onChange={handleInputChange} />
                    On Sale
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="admin-btn">
                  Cancel
                </button>
                <button type="submit" className="admin-btn primary">
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {products.length > 0 ? (
        <div className="admin-products-grid">
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="admin-product-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={product.images?.[0] || "/placeholder.svg?height=200&width=300&query=jewelry product"}
                alt={product.name}
                className="admin-product-image"
                onError={(e) => {
                  e.target.src = "/jewelry-product.png"
                }}
              />
              <div className="admin-product-info">
                <h3 className="admin-product-title">{product.name}</h3>
                <span className="admin-product-category">{product.category}</span>

                <div className="admin-product-price">
                  {product.salePrice ? (
                    <>
                      <span className="sale-price">${product.salePrice}</span>
                      <span className="original-price">${product.price}</span>
                    </>
                  ) : (
                    `$${product.price}`
                  )}
                </div>

                <div className="status-badges">
                  {product.isNewArrival && <span className="badge new">New</span>}
                  {product.isOnSale && <span className="badge sale">Sale</span>}
                  {product.stock === 0 && <span className="badge out-of-stock">Out of Stock</span>}
                  <span className="badge">Stock: {product.stock}</span>
                </div>

                <div className="admin-product-actions">
                  <button onClick={() => handleEdit(product)} className="admin-btn small">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="admin-btn danger small">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          <p>No products found. Add your first product to get started.</p>
        </div>
      )}
    </div>
  )
}

export default ProductManagement
