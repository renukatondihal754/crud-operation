import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/items';

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (err) {
      console.error('Fetch error:', err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
        alert('Item updated successfully!');
      } else {
        await axios.post(API_URL, form);
        alert('Item added successfully!');
      }
      setForm({ name: '', description: '' });
      setEditId(null);
      fetchItems();
    } catch (err) {
      console.error('Submit error:', err.message);
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description });
    setEditId(item.id);
  };

  const handleDelete = async (item) => {
    try {
      await axios.delete(`${API_URL}/${item.id}`);
      alert('Item deleted successfully!');
      fetchItems();
    } catch (err) {
      console.error('Delete error:', err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Item Manager</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <input
            name="name"
            placeholder="Enter item name"
            value={form.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <input
            name="description"
            placeholder="Enter item description"
            value={form.description}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {editId ? 'Update' : 'Add'} Item
        </button>
      </form>

      {/* Table displaying the items */}
      <div className="table-responsive">

        <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(item)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default App;
