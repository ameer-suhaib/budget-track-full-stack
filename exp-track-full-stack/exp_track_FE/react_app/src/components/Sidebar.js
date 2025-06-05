import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css'

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">💰 FinanceApp</h2>
      <nav className="nav-links">
        <Link to="/dashboard">📊 Dashboard</Link>
        <Link to="/transactions">📄 Transactions</Link>
        <Link to="/add-category">🗂 Add Category</Link>
        <br></br>
        <button className="logout-button" onClick={handleLogout}>
        🔓 Logout
      </button>
      </nav>
      
    </aside>
  );
};

export default Sidebar;
