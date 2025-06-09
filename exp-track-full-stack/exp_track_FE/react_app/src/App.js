import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import AddCategory from './components/AddCategory';
import BudgetPage from './pages/BudgetPage'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('access_token'));
  }, [location]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/transactions" element={isLoggedIn ? <TransactionsPage /> : <Navigate to="/" />} />
        <Route path="/add-category" element={isLoggedIn ? <AddCategory /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/budgets" element={<BudgetPage />} />
      </Routes>
    </div>
  );
};

export default App;
