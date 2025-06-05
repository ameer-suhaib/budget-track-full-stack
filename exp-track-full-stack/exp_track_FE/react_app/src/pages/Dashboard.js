import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import * as d3 from 'd3';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css'
import '../styles/Sidebar.css'

const Dashboard = () => {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

  useEffect(() => {
    API.get('/summary/')
      .then(res => setSummary(res.data))
      .catch(err => console.error('Error fetching summary:', err));
  }, []);

  useEffect(() => {
    const data = [
      { label: 'Income', value: summary.income },
      { label: 'Expenses', value: summary.expenses },
    ];
    console.log(summary,"summm");
    

    const svg = d3.select('#chart');
    svg.selectAll('*').remove();

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(60).outerRadius(radius);
    const color = d3.scaleOrdinal()
        .domain(['Income', 'Expenses'])
        .range(['#4CAF50', '#F44336']);

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const arcs = g.selectAll('g')
      .data(pie(data))
      .enter()
      .append('g');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label));


    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text(d => d.data.label);
  }, [summary]);

  console.log(summary,"iii");
  

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <h2 className="dashboard-title">Dashboard Overview</h2>
        <section className="card-grid">
          <div className="box-card"><h3>Income</h3><p>₹{summary.income}</p></div>
          <div className="box-card"><h3>Expense</h3><p>₹{summary.expenses}</p></div>
          <div className="box-card"><h3>Balance</h3><p>₹{summary.balance}</p></div>
        </section>
        <section className="box-card chart-card">
          <h3>Income vs Expenses</h3>
          <svg id="chart"></svg>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
