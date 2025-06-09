import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import MainLayout from '../layouts/MainLayout';



const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [error, setError] = useState('');

  // Fetch budgets on page load
  useEffect(() => {
    API.get('/budget/')
      .then(res => setBudgets(res.data))
      .catch(err => {
        console.error(err);
        setError('Failed to fetch budgets');
      });
  }, []);

  const handleAddBudget = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/budget/', { amount, month });
      setBudgets([...budgets, res.data]);
      setAmount('');
      setMonth('');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.non_field_errors
          ? err.response.data.non_field_errors.join(', ')
          : err.response?.data
          ? JSON.stringify(err.response.data)
          : 'Failed to add budget'
      );
    }
  };

  return (
    <MainLayout>
    <div style={{ padding: '20px' }}>

      <h2>Monthly Budgets</h2>

      <form onSubmit={handleAddBudget} style={{ marginBottom: '20px' }}>
        <div>
          <label>Amount: </label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Month (yyyy-mm-01): </label>
          <input
            type="date"
            value={month}
            onChange={e => setMonth(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Budget</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <ul>
        {budgets.map(budget => (
          <li key={budget.id}>
            💰 {budget.amount} — 📅 {budget.month}
          </li>
        ))}
      </ul>
    </div>
    </MainLayout>
  );
};

export default BudgetPage;
