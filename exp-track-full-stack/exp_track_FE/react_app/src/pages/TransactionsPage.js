import React, { useEffect, useState,useCallback } from 'react';
import API from '../api/axios';
import MainLayout from '../layouts/MainLayout';

const initialFormState = {
  amount: '',
  type: 'expense',
  category: '',
  note: '',
  date: ''
};

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [formData, setFormData] = useState(initialFormState);
  const [filterData, setFilterData] = useState({
    type: '',
    category: '',
    minAmount: '',
    maxAmount: '',
    date: ''
  });

  


  useEffect(() => {
    API.get('/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to load categories', err));
  }, []);


  const fetchTransactions = useCallback(() => {
    const params = new URLSearchParams();
  
    if (filterData.type) params.append('type', filterData.type);
    if (filterData.category) params.append('category', filterData.category);
    if (filterData.minAmount) params.append('amount__gte', filterData.minAmount);
    if (filterData.maxAmount) params.append('amount__lte', filterData.maxAmount);
    if (filterData.date) params.append('date__lte', filterData.date);
  
    params.append('page', page);
  
    API.get(`/transactions/?${params.toString()}`)
      .then((res) => {
        const items = res.data.items;
        setTransactions(Array.isArray(items) ? items : []);
        const totalItems = res.data.metadata?.total_items ?? 0;
        const pageSize = res.data.metadata?.page_size ?? 1;
        const totalPages = Math.ceil(totalItems / pageSize);
        setHasMore(page < totalPages);
      })
      .catch((err) => {
        console.error('Failed to load transactions', err);
        setTransactions([]);
        setHasMore(false);
      });
  }, [filterData, page]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
  
    try {
      await API.delete(`/transactions/${id}/`);
      fetchTransactions();
    } catch (err) {
      console.error('Failed to delete transaction', err);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/transactions/${editingId}/`, formData);
      } else {
        await API.post('/transactions/', formData);
      }

      setFormData(initialFormState);
      setEditingId(null);
      fetchTransactions();
    } catch (err) {
      console.error('Failed to save transaction', err);
    }
  };

  // Start Editing
  const handleEdit = (tx) => {
    setFormData({
      amount: tx.amount,
      type: tx.type,
      category: tx.category?.id || '',
      note: tx.note || '',
      date: tx.date,
    });
    setEditingId(tx.id);
  };

  return (
    <MainLayout>

    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>{editingId ? 'Edit Transaction' : 'Add Transaction'}</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>

        <div>
          <label>Type:</label>
          <select value={formData.type} required
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label>Category:</label>
          <select value={formData.category} required
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Amount:</label>
          <input type="number" value={formData.amount} required
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
        </div>

        <div>
        <label>Date:</label><br />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
      </div>

        <div>
          <label>Note:</label>
          <input type="text" value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
        </div>

        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null);
            setFormData(initialFormState);
          }}>Cancel</button>
        )}
      </form>
      
      <h2>Filter Transaction</h2>

      <select value={filterData.type} onChange={(e) => setFilterData({ ...filterData, type: e.target.value })}>
      <option value="">All Types</option>
      <option value="income">Income</option>
      <option value="expense">Expense</option>
    </select>

    <select value={filterData.category} onChange={(e) => setFilterData({ ...filterData, category: e.target.value })}>
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
      ))}
    </select>

    <input
      type="number"
      placeholder="Min Amount"
      value={filterData.minAmount}
      onChange={(e) => setFilterData({ ...filterData, minAmount: e.target.value })}
    />

    <input
      type="number"
      placeholder="Max Amount"
      value={filterData.maxAmount}
      onChange={(e) => setFilterData({ ...filterData, maxAmount: e.target.value })}
    />

    <button onClick={() => {
      setPage(1);
      fetchTransactions();
    }}>Apply Filters</button>

    <button onClick={() => {
      setFilterData({ type: '', category: '', minAmount: '', maxAmount: '', date: '' });
      setPage(1);
      fetchTransactions();
    }}>Reset Filters</button>

      <h2>Transactions List</h2>
      {transactions.length === 0 && <p>No transactions found.</p>}

      {transactions.map((tx) => (
        <div key={tx.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <p><strong>Date:</strong> {tx.date}</p>
          <p><strong>Type:</strong> {tx.type}</p>
          <strong>Category:</strong> {tx.category ? tx.category.name : 'N/A'}<br />
          <p><strong>Amount:</strong> ₹{tx.amount}</p>
          {tx.note && <p><strong>Note:</strong> {tx.note}</p>}
          <button onClick={() => handleEdit(tx)} style={{ marginLeft: '10px', color: 'green' ,width: 200}}>Edit</button>
          <button onClick={() => handleDelete(tx.id)} style={{ marginLeft: '10px', color: 'red' ,width: 200}}>
            Delete
          </button>
        </div>
      ))}

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>Prev</button>
        <span style={{ margin: '0 10px' }}>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={!hasMore}>Next</button>
      </div>
    </div>
    </MainLayout>
  );
};

export default TransactionsPage;
