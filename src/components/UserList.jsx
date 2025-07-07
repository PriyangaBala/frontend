function UserList({ users, onApprove, onDelete }) {
    return (
        <div className="user-list">
            {users.map((user) => (
                <div key={user.id} className="user-card">
                    <h3>{user.username}</h3>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                    <p>Approved: {user.approved ? 'Yes' : 'No'}</p>
                    {!user.approved && <button onClick={() => onApprove(user.id)}>Approve</button>}
                    <button onClick={() => onDelete(user.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default UserList;