import React, { useState } from 'react';
import { PlusCircle, FileText, CheckSquare } from 'lucide-react';

const TaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, description);
    setTitle('');
    setDescription('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <div className="input-with-icon">
          <CheckSquare className="input-icon" size={18} />
          <input 
            type="text" 
            placeholder="What needs to be done?" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="input-with-icon">
          <FileText className="input-icon" size={18} />
          <input 
            type="text" 
            placeholder="Add a description (optional)..." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <button type="submit" className="action-btn primary-btn add-btn">
        <PlusCircle size={20} />
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
