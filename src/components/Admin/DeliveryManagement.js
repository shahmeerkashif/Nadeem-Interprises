import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  getDeliveryCharges, 
  addDeliveryCharge, 
  updateDeliveryCharge, 
  deleteDeliveryCharge 
} from '../../services/firebase';
import './AdminComponents.css';

const DeliveryManagement = () => {
  const [deliveryCharges, setDeliveryCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCharge, setEditingCharge] = useState(null);
  const [formData, setFormData] = useState({
    city: '',
    charge: '',
    estimatedDays: '2-5'
  });

  useEffect(() => {
    fetchDeliveryCharges();
  }, []);

  const fetchDeliveryCharges = async () => {
    try {
      setLoading(true);
      const charges = await getDeliveryCharges();
      setDeliveryCharges(charges.sort((a, b) => a.city.localeCompare(b.city)));
    } catch (err) {
      setError('Failed to load delivery charges');
      console.error('Error fetching delivery charges:', err);
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
      city: '',
      charge: '',
      estimatedDays: '2-5'
    });
    setEditingCharge(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const chargeData = {
        city: formData.city.trim(),
        charge: parseFloat(formData.charge),
        estimatedDays: formData.estimatedDays
      };

      if (editingCharge) {
        await updateDeliveryCharge(editingCharge.id, chargeData);
      } else {
        await addDeliveryCharge(chargeData);
      }

      await fetchDeliveryCharges();
      resetForm();
    } catch (err) {
      setError('Failed to save delivery charge');
      console.error('Error saving delivery charge:', err);
    }
  };

  const handleEdit = (charge) => {
    setFormData({
      city: charge.city,
      charge: charge.charge.toString(),
      estimatedDays: charge.estimatedDays || '2-5'
    });
    setEditingCharge(charge);
    setShowForm(true);
  };

  const handleDelete = async (chargeId) => {
    if (window.confirm('Are you sure you want to delete this delivery charge?')) {
      try {
        await deleteDeliveryCharge(chargeId);
        await fetchDeliveryCharges();
      } catch (err) {
        setError('Failed to delete delivery charge');
        console.error('Error deleting delivery charge:', err);
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
        <h2>Delivery Management</h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="admin-btn primary"
        >
          + Add City
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
              <h3>{editingCharge ? 'Edit Delivery Charge' : 'Add Delivery Charge'}</h3>
              <button onClick={resetForm} className="modal-close">×</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-group">
                <label htmlFor="city">City Name *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter city name"
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="charge">Delivery Charge ($) *</label>
                  <input
                    type="number"
                    id="charge"
                    name="charge"
                    value={formData.charge}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="estimatedDays">Estimated Delivery</label>
                  <select
                    id="estimatedDays"
                    name="estimatedDays"
                    value={formData.estimatedDays}
                    onChange={handleInputChange}
                  >
                    <option value="1-2">1-2 business days</option>
                    <option value="2-3">2-3 business days</option>
                    <option value="2-5">2-5 business days</option>
                    <option value="3-7">3-7 business days</option>
                    <option value="5-10">5-10 business days</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="admin-btn">
                  Cancel
                </button>
                <button type="submit" className="admin-btn primary">
                  {editingCharge ? 'Update Charge' : 'Add Charge'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      <div className="admin-table-container">
        <table className="delivery-table">
          <thead>
            <tr>
              <th>City</th>
              <th>Delivery Charge</th>
              <th>Estimated Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryCharges.map((charge) => (
              <tr key={charge.id}>
                <td>{charge.city}</td>
                <td>
                  {charge.charge === 0 ? (
                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>FREE</span>
                  ) : (
                    `$${charge.charge.toFixed(2)}`
                  )}
                </td>
                <td>{charge.estimatedDays || '2-5'} business days</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEdit(charge)}
                      className="admin-btn small"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(charge.id)}
                      className="admin-btn danger small"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {deliveryCharges.length === 0 && (
          <div className="no-data">
            <p>No delivery charges configured. Add cities to get started.</p>
          </div>
        )}
      </div>

      <div className="delivery-info-section">
        <h3>Delivery Information</h3>
        <div className="info-cards">
          <div className="info-card">
            <h4>📦 Free Delivery</h4>
            <p>Set charge to $0.00 for free delivery cities</p>
          </div>
          <div className="info-card">
            <h4>🚚 Express Delivery</h4>
            <p>Use 1-2 business days for express delivery options</p>
          </div>
          <div className="info-card">
            <h4>📍 Remote Areas</h4>
            <p>Higher charges can be set for remote locations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryManagement;
