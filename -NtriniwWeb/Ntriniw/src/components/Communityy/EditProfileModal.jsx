import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
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

    const modalContent = (
        <div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{
                zIndex: 999999,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }}
        >
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            ></div>
            <div
                className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 relative"
                style={{ position: 'relative', zIndex: 1 }}
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-gray-900 font-bold text-xl">Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}

                    <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            className="bg-gray-50 text-gray-900 w-full rounded-lg px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            className="bg-gray-50 text-gray-900 w-full rounded-lg px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="bg-gray-100 text-gray-600 w-full rounded-lg px-4 py-3 border border-gray-200 focus:outline-none cursor-not-allowed"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled // Often email change requires re-verification, keeping it disabled for safety or enabled if backend allows
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-cyan-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    // Use React Portal to render modal at the root level
    return ReactDOM.createPortal(
        modalContent,
        document.body
    );
};

export default EditProfileModal;
