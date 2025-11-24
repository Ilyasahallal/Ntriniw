import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import AuthService from '../../services/api';

const EditProfileModal = ({ isOpen, onClose, user, onProfileUpdated }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || ''
            });
        }
    }, [user]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const updatedUser = {
            ...user,
            ...formData
        };

        AuthService.updateUser(updatedUser)
            .then((response) => {
                if (response.data.status === "success") {
                    // Update local storage if it's the current user
                    const currentUser = AuthService.getCurrentUser();
                    if (currentUser && currentUser.id === user.id) {
                        const newUserData = { ...currentUser, ...formData };
                        localStorage.setItem('user', JSON.stringify(newUserData));
                    }
                    
                    if (onProfileUpdated) onProfileUpdated(response.data.payload);
                    onClose();
                    window.location.reload();
                } else {
                    setError('Failed to update profile.');
                }
            })
            .catch((err) => {
                console.error("Error updating profile:", err);
                setError('An error occurred.');
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 w-full max-w-md rounded-xl border border-gray-800 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <h2 className="text-white font-bold text-lg">Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                    
                    <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-2">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            className="bg-gray-800 text-white w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-2">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            className="bg-gray-800 text-white w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-500 text-sm mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="bg-gray-800 text-white w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled // Often email change requires re-verification, keeping it disabled for safety or enabled if backend allows
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
