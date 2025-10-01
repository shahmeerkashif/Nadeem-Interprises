import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  getGalleryImages, 
  addGalleryImage, 
  deleteGalleryImage 
} from '../../services/firebase';
import './AdminComponents.css';

const GalleryManagement = () => {
  const [galleryData, setGalleryData] = useState({
    factory: [],
    machinery: [],
    showroom: [],
    products: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    section: 'factory',
    title: '',
    description: '',
    url: '',
    order: 0
  });

  const sections = [
    { key: 'factory', label: 'Our Factory' },
    { key: 'machinery', label: 'Our Machinery' },
    { key: 'showroom', label: 'Our Showroom' },
    { key: 'products', label: 'Our Product Gallery' }
  ];

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      const promises = sections.map(section => 
        getGalleryImages(section.key).catch(err => {
          console.error(`Error fetching ${section.key} images:`, err);
          return [];
        })
      );
      
      const results = await Promise.all(promises);
      
      setGalleryData({
        factory: results[0] || [],
        machinery: results[1] || [],
        showroom: results[2] || [],
        products: results[3] || []
      });
    } catch (err) {
      setError('Failed to load gallery images');
      console.error('Error fetching gallery data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      section: 'factory',
      title: '',
      description: '',
      url: '',
      order: 0
    });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const imageData = {
        section: formData.section,
        title: formData.title,
        description: formData.description,
        url: formData.url,
        order: parseInt(formData.order)
      };

      await addGalleryImage(imageData);
      await fetchGalleryData();
      resetForm();
    } catch (err) {
      setError('Failed to add gallery image');
      console.error('Error adding gallery image:', err);
    }
  };

  const handleDelete = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteGalleryImage(imageId);
        await fetchGalleryData();
      } catch (err) {
        setError('Failed to delete image');
        console.error('Error deleting image:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Gallery Management</h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="admin-btn primary"
        >
          + Add Image
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <motion.div
          className="admin-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Gallery Image</h3>
              <button onClick={resetForm} className="modal-close">×</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="section">Section *</label>
                  <select
                    id="section"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    required
                  >
                    {sections.map(section => (
                      <option key={section.key} value={section.key}>
                        {section.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label htmlFor="order">Display Order</label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="title">Image Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="url">Image URL *</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  required
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="admin-btn">
                  Cancel
                </button>
                <button type="submit" className="admin-btn primary">
                  Add Image
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      <div className="gallery-sections">
        {sections.map((section) => {
          const images = galleryData[section.key] || [];
          
          return (
            <div key={section.key} className="gallery-section">
              <h3>{section.label} ({images.length} images)</h3>
              
              {images.length > 0 ? (
                <div className="gallery-grid">
                  {images.map((image) => (
                    <div key={image.id} className="gallery-item">
                      <img 
                        src={image.url || image.imageUrl || '/placeholder-image.jpg'} 
                        alt={image.title}
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      <div className="gallery-item-info">
                        <h4>{image.title}</h4>
                        {image.description && <p>{image.description}</p>}
                        <div className="gallery-item-actions">
                          <button 
                            onClick={() => handleDelete(image.id)}
                            className="admin-btn danger small"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">
                  <p>No images in this section. Add some images to get started.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GalleryManagement;
