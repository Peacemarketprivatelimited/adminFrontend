import { useEffect, useState } from 'react';
import tasksApi, { Task } from '../../api/tasksapi';
import TasksHeader from './components/TasksHeader';
import TasksAnalytics from './components/TasksAnalytics';
import TasksTable from './components/TasksTable';
import CreateTaskModal from './components/CreateTaskModel';
import EditTaskModal from './components/EditTaskModel';
import DeleteConfirmModal from './components/DeleteConfirmModel';
import { toast } from 'react-hot-toast';

// Add interface for API responses
interface TasksResponse {
  success: boolean;
  tasks: Task[];
}

interface AnalyticsResponse {
  success: boolean;
  data: {
    totalTasks: number;
    activeTasks: number;
    totalSubmissions: number;
    totalPointsAwarded: number;
  };
}

interface GenericResponse {
  success: boolean;
  message?: string;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    activeTasks: 0,
    totalSubmissions: 0,
    totalPointsAwarded: 0
  });

  useEffect(() => {
    loadTasks();
    loadAnalytics();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksApi.adminListTasks() as TasksResponse;
      if (response.success) {
        // Remove duplicates by _id just in case
        const uniqueTasks = Array.from(
          new Map(response.tasks.map((task: Task) => [task._id, task])).values()
        ) as Task[];
        setTasks(uniqueTasks);
      }
    } catch (error: any) {
      console.error('Failed to load tasks:', error);
      toast.error(error?.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await tasksApi.getTasksSummary() as AnalyticsResponse;
      if (response.success) {
        // Ensure we have the correct structure
        setAnalytics({
          totalTasks: response.data?.totalTasks || 0,
          activeTasks: response.data?.activeTasks || 0,
          totalSubmissions: response.data?.totalSubmissions || 0,
          totalPointsAwarded: response.data?.totalPointsAwarded || 0
        });
      }
    } catch (error: any) {
      console.error('Failed to load analytics:', error);
      // Set default values on error
      setAnalytics({
        totalTasks: 0,
        activeTasks: 0,
        totalSubmissions: 0,
        totalPointsAwarded: 0
      });
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      const response = await tasksApi.createTask(data) as GenericResponse;
      if (response.success) {
        toast.success('Task created successfully');
        setShowCreateModal(false);
        loadTasks();
        loadAnalytics();
      }
    } catch (error: any) {
      console.error('Failed to create task:', error);
      toast.error(error?.response?.data?.message || 'Failed to create task');
    }
  };

  const handleEditTask = async (data: any) => {
    if (!selectedTask) return;
    
    try {
      const response = await tasksApi.updateTask(selectedTask._id, data) as GenericResponse;
      if (response.success) {
        toast.success('Task updated successfully');
        setShowEditModal(false);
        setSelectedTask(null);
        loadTasks();
        loadAnalytics();
      }
    } catch (error: any) {
      console.error('Failed to update task:', error);
      toast.error(error?.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    try {
      const response = await tasksApi.deleteTask(selectedTask._id) as GenericResponse;
      if (response.success) {
        toast.success('Task deleted successfully');
        setShowDeleteModal(false);
        setSelectedTask(null);
        loadTasks();
        loadAnalytics();
      }
    } catch (error: any) {
      console.error('Failed to delete task:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete task');
    }
  };


  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        <TasksHeader onCreateClick={() => setShowCreateModal(true)} />
        
        <TasksAnalytics analytics={analytics} />

        <TasksTable
          tasks={tasks}
          loading={loading}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />

        {showCreateModal && (
          <CreateTaskModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateTask}
          />
        )}

        {showEditModal && selectedTask && (
          <EditTaskModal
            task={selectedTask}
            onClose={() => {
              setShowEditModal(false);
              setSelectedTask(null);
            }}
            onSubmit={handleEditTask}
          />
        )}

        {showDeleteModal && selectedTask && (
          <DeleteConfirmModal
            taskTitle={selectedTask.title}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedTask(null);
            }}
            onConfirm={handleDeleteTask}
          />
        )}
      </div>
    </div>
  );
};

export default Tasks;