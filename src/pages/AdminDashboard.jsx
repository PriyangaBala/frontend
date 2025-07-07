import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserList from '../components/UserList';
import TaskList from '../components/TaskList';
import { getAllUsers, approveUser, deleteUser, getAllTasks, getPendingUsers } from '../services/adminService';
import { updateTask, deleteTask } from '../services/taskService';

function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', dueDate: '', priority: '', status: '' });

    useEffect(() => {
        if (user && user.role === 'ROLE_ADMIN') {
            fetchPendingUsers();
            fetchTasks();
        }
    }, [user]);

    const fetchPendingUsers = async () => {
        try {
            const response = await getPendingUsers();
            setPendingUsers(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch pending users');
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await getAllTasks();
            setTasks(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch tasks');
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveUser(id);
            fetchPendingUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to approve user');
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id);
            fetchPendingUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setEditForm({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status: task.status,
        });
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await updateTask(editingTask.id, editForm);
            setTasks(tasks.map((task) => (task.id === editingTask.id ? response.data : task)));
            setEditingTask(null);
            setEditForm({ title: '', description: '', dueDate: '', priority: '', status: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update task');
            console.error('Update error:', err.response); // Log for debugging
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id);
            setTasks(tasks.filter((task) => task.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete task');
            console.error('Delete error:', err.response); // Log for debugging
        }
    };

    if (!user || user.role !== 'ROLE_ADMIN') return <p>Access Denied</p>;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {error && <p className="error">{error}</p>}
            <h2>Pending User Requests</h2>
            <UserList users={pendingUsers} onApprove={handleApprove} onDelete={handleDeleteUser} />
            <h2>All Tasks</h2>
            {editingTask && (
                <form onSubmit={handleUpdateTask}>
                    <h3>Edit Task</h3>
                    <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        placeholder="Title"
                        required
                    />
                    <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        placeholder="Description"
                    />
                    <input
                        type="date"
                        value={editForm.dueDate}
                        onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                        required
                    />
                    <select
                        value={editForm.priority}
                        onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                        required
                    >
                        <option value="">Select Priority</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                    <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                    <button type="submit">Update Task</button>
                    <button type="button" onClick={() => setEditingTask(null)}>Cancel</button>
                </form>
            )}
            <TaskList tasks={tasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />
        </div>
    );
}

export default AdminDashboard;