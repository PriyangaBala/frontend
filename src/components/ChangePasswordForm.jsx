import { useState } from 'react';

function ChangePasswordForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h2>Change Password</h2>
            <input
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                value={formData.oldPassword}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                required
            />
            <button type="submit">Change Password</button>
        </form>
    );
}

export default ChangePasswordForm;