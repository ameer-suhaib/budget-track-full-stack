import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import MainLayout from '../layouts/MainLayout';


const initialForm = {
  name: '',
  type: 'income',
};

const CategoryManager = () => {
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories/');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/categories/${editingId}/`, form);
      } else {
        await API.post('/categories/', form);
      }
      setForm(initialForm);
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      alert('Failed to save category');
      console.error(err);
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, type: cat.type });
    setEditingId(cat.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await API.delete(`/categories/${id}/`);
      fetchCategories();
    } catch (err) {
      alert('Failed to delete category');
      console.error(err);
    }
  };

  return (
    <MainLayout>
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '1rem' }}>
      <h2>{editingId ? 'Edit Category' : 'Add Category'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm(initialForm);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <hr style={{ margin: '20px 0' }} />

      <h3>Category List</h3>
      {categories.length === 0 && <p>No categories found.</p>}
      {categories.map((cat) => (
        <div
          key={cat.id}
          style={{
            border: '1px solid #ccc',
            marginBottom: '10px',
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <strong>{cat.name}</strong> ({cat.type})
          </div>
          <div>
            <button onClick={() => handleEdit(cat)}>Edit</button>
            <button onClick={() => handleDelete(cat.id)} style={{ marginLeft: '10px' }}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
    </MainLayout>
  );
};

export default CategoryManager;
