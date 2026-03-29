import React from 'react';
import { CheckCircle, Undo2, Trash2 } from 'lucide-react';

const TaskCard = ({ task, toggleStatus, deleteTask }) => {
  const isCompleted = task.status === 'completed';

  return (
    <div className={`task-card ${isCompleted ? 'completed-card' : 'pending-card'}`}>
      <div className="task-info">
        <div className="task-header-row">
          <h3 className="task-title">{task.title}</h3>
          <span className={`status-badge ${isCompleted ? 'badge-success' : 'badge-warning'}`}>
            {isCompleted ? 'Completed' : 'Pending'}
          </span>
        </div>
        
        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}
      </div>

      <div className="task-actions">
        {isCompleted ? (
          <button 
            className="action-icon-btn btn-undo" 
            onClick={() => toggleStatus(task)} 
            title="Mark Pending"
          >
            <Undo2 size={18} />
          </button>
        ) : (
          <button 
            className="action-icon-btn btn-complete" 
            onClick={() => toggleStatus(task)} 
            title="Mark Complete"
          >
            <CheckCircle size={18} />
          </button>
        )}
        
        <button 
          className="action-icon-btn btn-delete" 
          onClick={() => deleteTask(task.id)} 
          title="Delete Task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
