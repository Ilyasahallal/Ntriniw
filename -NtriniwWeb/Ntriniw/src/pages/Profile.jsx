import React from 'react';
import AuthService from '../services/api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const user = AuthService.getCurrentUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
        window.location.reload();
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark text-white">
                <div className="text-center">
                    <h2 className="text-2xl mb-4">Please log in to view your profile</h2>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-primary px-6 py-2 rounded-lg hover:bg-opacity-80 transition-colors"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark text-white p-8 pt-24">
            <div className="max-w-2xl mx-auto bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-3xl font-bold">
                        {user.firstName?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                    <h2 className="text-xl font-semibold mb-4">Account Details</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-gray-900 p-4 rounded-lg">
                            <span className="text-gray-400 block text-sm">Email</span>
                            <span>{user.email}</span>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg">
                            <span className="text-gray-400 block text-sm">Member Since</span>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="mt-8 w-full bg-red-500/10 text-red-500 border border-red-500/50 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 font-semibold"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;
