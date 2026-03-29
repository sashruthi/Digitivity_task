import React from 'react';
import { LogOut, User } from 'lucide-react';

const Header = ({ user, handleLogout }) => {
  return (
    <header className="main-header profile-header">
      <div className="brand-section">
        <h1>Task Manager</h1>

      </div>

      {user && (
        <div className="profile-card">
          <div className="avatar-wrapper">
            <User className="avatar-icon" size={20} />
          </div>
          <div className="profile-info">
            <span className="profile-name">{user.name}</span>
            <span className="profile-email">{user.email}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
