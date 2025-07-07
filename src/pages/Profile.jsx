import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { getProfile, changePassword } from '../services/userService';

function Profile() {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const response = await getProfile();
            setProfile(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch profile');
        }
    };

    const handleChangePassword = async (formData) => {
        try {
            await changePassword(formData);
            setSuccess('Password changed successfully');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        }
    };

    if (!user) return <p>Please login to view your profile.</p>;

    return (
        <div>
            <h1>Profile</h1>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            {profile && (
                <div className="form-container">
                    <p><strong>Username:</strong> {profile.username}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                </div>
            )}
            <ChangePasswordForm onSubmit={handleChangePassword} />
        </div>
    );
}

export default Profile;