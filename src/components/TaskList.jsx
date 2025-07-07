// src/components/TaskList.js
import React from 'react';

function TaskList({ tasks, onEdit, onDelete }) {
    return (
        <div>
            {tasks.length === 0 ? (
                <p>No tasks available</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <p>Due Date: {task.dueDate}</p>
                            <p>Priority: {task.priority}</p>
                            <p>Status: {task.status}</p>
                            <button onClick={() => onEdit(task)}>Edit</button>
                            <button onClick={() => onDelete(task.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TaskList;