// src/layouts/MainLayout.js
import React from 'react';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '1rem', background: '#f9f9f9' }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;