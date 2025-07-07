import { AuthContext } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import { useState, useEffect, useContext } from 'react';

function Tasks() {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            fetchTasks();
        }
    }, [user]);

    const fetchTasks = async () => {
        try {
            const response = await getTasks();
            setTasks(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch tasks');
        }
    };

    const handleCreateOrUpdate = async (formData) => {
        try {
            if (editingTask) {
                await updateTask(editingTask.id, formData);
                setSuccess('Task updated successfully');
                setEditingTask(null);
            } else {
                await createTask(formData);
                setSuccess('Task created successfully');
            }
            fetchTasks();
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save task');
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setSuccess('');
        setError('');
    };

    const handleDelete = async (id) => {
        try {
            await deleteTask(id);
            setSuccess('Task deleted successfully');
            fetchTasks();
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete task');
        }
    };

    if (!user) return <p>Please login to view tasks.</p>;

    return (
        <div>
            <h1>My Tasks</h1>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <TaskForm onSubmit={handleCreateOrUpdate} initialData={editingTask || {}} />
            <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
    );
}

export default Tasks;