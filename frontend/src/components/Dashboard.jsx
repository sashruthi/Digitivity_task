import React from 'react';

const Dashboard = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="dashboard-container">
      <div className="stats-row">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <span className="stat-number">{total}</span>
        </div>
        <div className="stat-card pending-stat">
          <h3>Pending</h3>
          <span className="stat-number">{pending}</span>
        </div>
        <div className="stat-card completed-stat">
          <h3>Completed</h3>
          <span className="stat-number">{completed}</span>
        </div>
      </div>
      
      <div className="progress-section">
        <div className="progress-label">
          <span>Overall Progress</span>
          <span>{percentage}%</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-fill" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
