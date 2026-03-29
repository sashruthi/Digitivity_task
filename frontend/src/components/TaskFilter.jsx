import React from 'react';
import { Search } from 'lucide-react';

const TaskFilter = ({ currentFilter, setFilter, searchQuery, setSearchQuery }) => {
  return (
    <div className="filter-board">
      <div className="search-box">
        <Search className="search-icon" size={18} />
        <input 
          type="text" 
          placeholder="Search tasks..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-buttons">
        <button 
          className={currentFilter === 'all' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('all')}
        >All</button>
        <button 
          className={currentFilter === 'pending' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('pending')}
        >Pending</button>
        <button 
          className={currentFilter === 'completed' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('completed')}
        >Completed</button>
      </div>
    </div>
  );
};

export default TaskFilter;
