import React from 'react';

interface TasksHeaderProps {
  onCreateClick: () => void;
}

const TasksHeader: React.FC<TasksHeaderProps> = ({ onCreateClick }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tasks Management</h1>
          <p className=" mt-2">Create and manage user tasks for earning points</p>
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Task
        </button>
      </div>
    </div>
  );
};

export default TasksHeader;