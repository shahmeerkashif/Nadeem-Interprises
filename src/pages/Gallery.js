import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick';
import { getGalleryImages } from '../services/firebase';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Gallery.css';

const Gallery = () => {
  const [galleryData, setGalleryData] = useState({
    factory: [],
    machinery: [],
    showroom: [],
    products: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  const sections = [
    { key: 'factory', title: 'Our Factory', description: 'State-of-the-art manufacturing facility' },
    { key: 'machinery', title: 'Our Machinery', description: 'Precision equipment for perfect craftsmanship' },
    { key: 'showroom', title: 'Our Showroom', description: 'Elegant display of our finest pieces' },
    { key: 'products', title: 'Our Product Gallery', description: 'Showcase of our exquisite jewelry collection' }
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

  const openModal = (image, title) => {
    setModalImage({ ...image, sectionTitle: title });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    fade: true,
    cssEase: 'linear'
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
    <div className="gallery-page">
      <div className="container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Gallery</h1>
          <p>Discover the artistry behind our exquisite jewelry collection</p>
        </motion.div>

        <div className="gallery-sections">
          {sections.map((section, sectionIndex) => {
            const images = galleryData[section.key] || [];
            
            return (
              <motion.section
                key={section.key}
                className="gallery-section"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="section-header">
                  <h2>{section.title}</h2>
                  <p>{section.description}</p>
                </div>

                {images.length > 0 ? (
                  <div className="gallery-slider">
                    <Slider {...sliderSettings}>
                      {images.map((image, index) => (
                        <div key={image.id || index} className="slide">
                          <div 
                            className="image-container"
                            onClick={() => openModal(image, section.title)}
                          >
                            <img 
                              src={image.url || image.imageUrl || '/placeholder-image.jpg'} 
                              alt={image.title || `${section.title} ${index + 1}`}
                              onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                              }}
                            />
                            <div className="image-overlay">
                              <div className="overlay-content">
                                <h3>{image.title || `${section.title} Image`}</h3>
                                <p>Click to view full size</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                ) : (
                  <div className="no-images">
                    <p>No images available for this section</p>
                  </div>
                )}
              </motion.section>
            );
          })}
        </div>

        {/* Image Modal */}
        <AnimatePresence>
          {modalImage && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="modal-content"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="modal-close" onClick={closeModal}>
                  ×
                </button>
                <div className="modal-image">
                  <img 
                    src={modalImage.url || modalImage.imageUrl || '/placeholder-image.jpg'} 
                    alt={modalImage.title || modalImage.sectionTitle}
                  />
                </div>
                <div className="modal-info">
                  <h3>{modalImage.title || `${modalImage.sectionTitle} Image`}</h3>
                  {modalImage.description && (
                    <p>{modalImage.description}</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Gallery;

