import React, { useState, useEffect } from 'react';
import { ShoppingBag, ShoppingCart, Plus, X, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
import './DataTable.css';

export const Store = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'SCHOOL_ADMIN' || user?.role === 'PRINCIPAL';
  
  const [activeTab, setActiveTab] = useState('PRODUCTS'); // PRODUCTS, MY_ORDERS, MANAGE_ORDERS
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'PRODUCTS') {
        const res = await apiClient.get('/store/products');
        setProducts(res.data);
      } else if (activeTab === 'MY_ORDERS') {
        const res = await apiClient.get('/store/my-orders');
        setOrders(res.data);
      } else if (activeTab === 'MANAGE_ORDERS' && isAdmin) {
        const res = await apiClient.get('/store/orders');
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch store data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/store/product', {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      });
      setIsModalOpen(false);
      setFormData({ name: '', price: '', stock: '' });
      fetchData();
    } catch (err: any) {
      alert('Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlaceOrder = async (productId: string, stock: number) => {
    if (stock < 1) {
      alert('Out of stock!');
      return;
    }
    if (!window.confirm('Place an order for this item?')) return;
    try {
      await apiClient.post('/store/order', { productId, quantity: 1 });
      alert('Order placed successfully!');
      fetchData();
    } catch (err: any) {
      alert('Failed to place order: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await apiClient.put(`/store/order/${orderId}/status`, { status });
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const renderStatusBadge = (status: string) => {
    if (status === 'COMPLETED') return <span style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-700)', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12}/> Completed</span>;
    if (status === 'CANCELLED') return <span style={{ backgroundColor: 'var(--danger-50)', color: 'var(--danger-700)', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={12}/> Cancelled</span>;
    return <span style={{ backgroundColor: 'var(--warning-50)', color: 'var(--warning-700)', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12}/> Pending</span>;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px' }}>
            <ShoppingBag size={28} color="var(--brand-500)" /> School Store
          </h2>
          <p style={{ margin: 0, color: 'var(--text-500)' }}>Purchase uniforms, books, and merchandise</p>
        </div>
        
        {isAdmin && activeTab === 'PRODUCTS' && (
          <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Product
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--surface-200)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('PRODUCTS')}
          style={{
            padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer',
            backgroundColor: activeTab === 'PRODUCTS' ? 'var(--brand-600)' : 'var(--surface-200)',
            color: activeTab === 'PRODUCTS' ? 'white' : 'var(--text-600)', transition: 'all 0.2s'
          }}
        >
          All Products
        </button>
        <button
          onClick={() => setActiveTab('MY_ORDERS')}
          style={{
            padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer',
            backgroundColor: activeTab === 'MY_ORDERS' ? 'var(--brand-600)' : 'var(--surface-200)',
            color: activeTab === 'MY_ORDERS' ? 'white' : 'var(--text-600)', transition: 'all 0.2s'
          }}
        >
          My Orders
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('MANAGE_ORDERS')}
            style={{
              padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === 'MANAGE_ORDERS' ? 'var(--brand-600)' : 'var(--surface-200)',
              color: activeTab === 'MANAGE_ORDERS' ? 'white' : 'var(--text-600)', transition: 'all 0.2s'
            }}
          >
            Manage Orders (Admin)
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)' }}>Loading...</div>
      ) : activeTab === 'PRODUCTS' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {products.map(product => (
            <div key={product.id} className="glass" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '140px', backgroundColor: 'var(--surface-100)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Package size={48} color="var(--brand-300)" />
              </div>
              <h3 style={{ margin: '0 0 8px', color: 'var(--text-900)', fontSize: '18px' }}>{product.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-600)' }}>${product.price.toFixed(2)}</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: product.stock > 0 ? 'var(--success-600)' : 'var(--danger-600)' }}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              <button 
                onClick={() => handlePlaceOrder(product.id, product.stock)}
                disabled={product.stock < 1}
                style={{ 
                  marginTop: 'auto', width: '100%', padding: '10px', borderRadius: '8px', border: 'none', 
                  backgroundColor: product.stock > 0 ? 'var(--brand-600)' : 'var(--surface-300)', 
                  color: 'white', fontWeight: 600, cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                }}
              >
                <ShoppingCart size={18} /> {product.stock > 0 ? 'Buy Now' : 'Sold Out'}
              </button>
            </div>
          ))}
          {products.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: 'var(--text-500)', backgroundColor: 'var(--surface-50)', borderRadius: '16px' }}>
              No products available in the store yet.
            </div>
          )}
        </div>
      ) : (
        <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          {orders.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-500)' }}>No orders found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--surface-50)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-500)', fontWeight: 600, borderBottom: '1px solid var(--surface-200)' }}>Order ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-500)', fontWeight: 600, borderBottom: '1px solid var(--surface-200)' }}>Product</th>
                  {activeTab === 'MANAGE_ORDERS' && <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-500)', fontWeight: 600, borderBottom: '1px solid var(--surface-200)' }}>Customer</th>}
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-500)', fontWeight: 600, borderBottom: '1px solid var(--surface-200)' }}>Date</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-500)', fontWeight: 600, borderBottom: '1px solid var(--surface-200)' }}>Price</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-500)', fontWeight: 600, borderBottom: '1px solid var(--surface-200)' }}>Status</th>
                  {activeTab === 'MANAGE_ORDERS' && <th style={{ padding: '16px', textAlign: 'right', color: 'var(--text-500)', fontWeight: 600, borderBottom: '1px solid var(--surface-200)' }}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--surface-200)' }}>
                    <td style={{ padding: '16px', color: 'var(--text-500)', fontSize: '13px' }}>{order.id.slice(0, 8).toUpperCase()}</td>
                    <td style={{ padding: '16px', color: 'var(--text-900)', fontWeight: 500 }}>
                      {order.product?.name} (x{order.quantity})
                    </td>
                    {activeTab === 'MANAGE_ORDERS' && (
                      <td style={{ padding: '16px', color: 'var(--text-600)' }}>
                        {order.user?.profile?.firstName} {order.user?.profile?.lastName}
                      </td>
                    )}
                    <td style={{ padding: '16px', color: 'var(--text-600)' }}>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td style={{ padding: '16px', color: 'var(--text-900)', fontWeight: 600 }}>${order.totalPrice.toFixed(2)}</td>
                    <td style={{ padding: '16px' }}>{renderStatusBadge(order.status)}</td>
                    {activeTab === 'MANAGE_ORDERS' && (
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        {order.status === 'PENDING' && (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                              style={{ background: 'var(--success-100)', color: 'var(--success-700)', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              Fulfill
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                              style={{ background: 'var(--danger-100)', color: 'var(--danger-700)', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Add New Product</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateProduct}>
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Winter Jacket" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Stock</label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
