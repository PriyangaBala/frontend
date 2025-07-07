import { useState, useEffect } from 'react';

function TaskForm({ onSubmit, initialData = {} }) {
  const emptyFormState = {
    title: '',
    description: '',
    dueDate: '',
    priority: 'LOW',
    status: 'PENDING',
  };

  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    priority: initialData.priority || 'LOW',
    status: initialData.status || 'PENDING',
  });
  const [error, setError] = useState('');

  // Update formData when initialData changes (e.g., when editing a new task)
  useEffect(() => {
    setFormData({
      title: initialData.title || '',
      description: initialData.description || '',
      dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
      priority: initialData.priority || 'LOW',
      status: initialData.status || 'PENDING',
    });
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    };
    try {
      await onSubmit(formattedData);
      setFormData(emptyFormState); // Reset form to empty state after successful submission
      setError(''); // Clear any previous errors
    } catch (err) {
      const errorMessage = err.response?.data || 'Failed to submit task';
      setError(errorMessage);
      console.error('TaskForm submit error:', err);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>{initialData.id ? 'Edit Task' : 'Create Task'}</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
      />
      <select name="priority" value={formData.priority} onChange={handleChange}>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>
      <button type="submit">{initialData.id ? 'Update' : 'Submit'}</button>
    </form>
  );
}

export default TaskForm;