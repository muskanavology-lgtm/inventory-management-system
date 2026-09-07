import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/items';

function App() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    category: ''
  });
  const [editingId, setEditingId] = useState(null);

  // 1. Fetch Items with Safe Checks
  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);
      // Fallback check: Agar res.data.data ho ya direct res.data array ho
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setItems(res.data.data);
      } else if (Array.isArray(res.data)) {
        setItems(res.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Submit Form (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clean numbers safely
    const cleanPrice = Number(formData.price);
    const cleanQuantity = Number(formData.quantity);

    const payload = {
      name: formData.name,
      quantity: cleanQuantity,
      price: cleanPrice,
      category: formData.category
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axios.post(API_URL, payload);
      }
      setFormData({ name: '', quantity: '', price: '', category: '' });
      fetchItems(); // Refresh inventory after change
    } catch (err) {
      console.error('Error submitting form:', err.response ? err.response.data : err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      category: item.category
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', quantity: '', price: '', category: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchItems();
      } catch (err) {
        console.error('Error deleting item:', err);
      }
    }
  };

  return (
    <div className="container">
      <h1>Inventory Management System</h1>

      <form className="item-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price ($)"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingId ? 'Update Item' : 'Add New Item'}
        </button>
        {editingId && (
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Current Inventory Stock</h2>
      <table className="item-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price ($)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(items) && items.length > 0 ? (
            items.map((item) => (
              <tr key={item._id} className={item.quantity < 5 ? 'low-stock' : ''}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>
                  {item.quantity}{' '}
                  {item.quantity < 5 && <span className="badge">Low Stock</span>}
                </td>
                <td>${item.price}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No items found in stock.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;