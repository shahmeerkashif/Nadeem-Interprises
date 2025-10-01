import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getOrders, updateOrderStatus } from '../../services/firebase';
import './AdminComponents.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orderStatuses = [
    { value: 'pending', label: 'Pending', class: 'status-pending' },
    { value: 'processing', label: 'Processing', class: 'status-processing' },
    { value: 'shipped', label: 'Shipped', class: 'status-shipped' },
    { value: 'delivered', label: 'Delivered', class: 'status-delivered' },
    { value: 'cancelled', label: 'Cancelled', class: 'status-cancelled' }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getOrders();
      setOrders(ordersData);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrders();
    } catch (err) {
      setError('Failed to update order status');
      console.error('Error updating order status:', err);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();
  };

  const getStatusClass = (status) => {
    const statusObj = orderStatuses.find(s => s.value === status);
    return statusObj ? statusObj.class : '';
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
        <h2>Order Management</h2>
        <div className="order-stats">
          <span>Total Orders: {orders.length}</span>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id.slice(-8)}</td>
                <td>
                  <div>
                    <strong>{order.customerInfo?.name}</strong><br />
                    <small>{order.customerInfo?.email}</small>
                  </div>
                </td>
                <td>{order.items?.length || 0} items</td>
                <td>${order.total?.toFixed(2) || '0.00'}</td>
                <td>
                  <select
                    value={order.status || 'pending'}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`status-select ${getStatusClass(order.status)}`}
                  >
                    {orderStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="admin-btn small"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="no-data">
            <p>No orders found.</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <motion.div
          className="admin-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h3>Order Details - #{selectedOrder.id.slice(-8)}</h3>
              <button onClick={() => setSelectedOrder(null)} className="modal-close">×</button>
            </div>

            <div className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Customer Name</label>
                  <input type="text" value={selectedOrder.customerInfo?.name || ''} readOnly />
                </div>
                <div className="admin-form-group">
                  <label>Email</label>
                  <input type="text" value={selectedOrder.customerInfo?.email || ''} readOnly />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Phone</label>
                  <input type="text" value={selectedOrder.customerInfo?.phone || ''} readOnly />
                </div>
                <div className="admin-form-group">
                  <label>City</label>
                  <input type="text" value={selectedOrder.customerInfo?.city || ''} readOnly />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Address</label>
                <textarea value={selectedOrder.customerInfo?.address || ''} readOnly rows="3" />
              </div>

              {selectedOrder.customerInfo?.notes && (
                <div className="admin-form-group">
                  <label>Order Notes</label>
                  <textarea value={selectedOrder.customerInfo.notes} readOnly rows="2" />
                </div>
              )}

              <div className="admin-form-group">
                <label>Order Items</label>
                <div className="order-items-list">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <img 
                        src={item.images?.[0] || '/placeholder-image.jpg'} 
                        alt={item.name}
                        className="table-image"
                      />
                      <div className="item-details">
                        <strong>{item.name}</strong>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${(item.salePrice || item.price)?.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Subtotal</label>
                  <input type="text" value={`$${selectedOrder.subtotal?.toFixed(2) || '0.00'}`} readOnly />
                </div>
                <div className="admin-form-group">
                  <label>Delivery Charge</label>
                  <input type="text" value={`$${selectedOrder.deliveryCharge?.toFixed(2) || '0.00'}`} readOnly />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Total Amount</label>
                <input 
                  type="text" 
                  value={`$${selectedOrder.total?.toFixed(2) || '0.00'}`} 
                  readOnly 
                  style={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                />
              </div>

              <div className="form-actions">
                <button 
                  onClick={() => setSelectedOrder(null)} 
                  className="admin-btn"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderManagement;
