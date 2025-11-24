import React, { useState, useEffect } from 'react';
import { FaSearch, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AuthService from '../services/api';
import LargeNav from '../components/Communityy/LargeNav';

const Search = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const loggedInUser = AuthService.getCurrentUser();
        setCurrentUser(loggedInUser);

        AuthService.getAllUsers()
            .then((response) => {
                if (response.data.status === "success") {
                    setUsers(response.data.payload || []);
                    setFilteredUsers(response.data.payload || []);
                }
            })
            .catch((err) => console.error("Error fetching users:", err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const results = users.filter(user =>
            (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const handleFollow = (e, targetUserId) => {
        e.preventDefault(); // Prevent navigation
        if (!currentUser) return;

        AuthService.followUser(targetUserId, currentUser.id)
            .then(() => {
                // Update local state
                const updatedCurrentUser = { ...currentUser, following: [...(currentUser.following || []), targetUserId] };
                setCurrentUser(updatedCurrentUser);
                localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
            })
            .catch(err => console.error("Error following user:", err));
    };

    const handleUnfollow = (e, targetUserId) => {
        e.preventDefault(); // Prevent navigation
        if (!currentUser) return;

        AuthService.unfollowUser(targetUserId, currentUser.id)
            .then(() => {
                // Update local state
                const updatedFollowing = (currentUser.following || []).filter(id => id !== targetUserId);
                const updatedCurrentUser = { ...currentUser, following: updatedFollowing };
                setCurrentUser(updatedCurrentUser);
                localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
            })
            .catch(err => console.error("Error unfollowing user:", err));
    };

    const isFollowing = (targetUserId) => {
        return currentUser && currentUser.following && currentUser.following.includes(targetUserId);
    };

    return (
        <div className="w-full min-h-screen bg-black text-white flex">
            <div className="w-[16%] border-r border-gray-800 h-screen sticky top-0 hidden lg:block">
                <LargeNav />
            </div>

            <div className="flex-1 p-8 max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-6">Search Athletes</h1>
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full bg-gray-900 border border-gray-800 rounded-full py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <Link
                                    to={`/Profile/${user.id}`}
                                    key={user.id}
                                    className="flex items-center justify-between p-4 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors border border-gray-800 hover:border-blue-500/50 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px]">
                                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                                                {user.firstName ? user.firstName.charAt(0) : <FaUser />}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{user.firstName} {user.lastName}</h3>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>

                                    {currentUser && currentUser.id !== user.id && (
                                        <button
                                            onClick={(e) => isFollowing(user.id) ? handleUnfollow(e, user.id) : handleFollow(e, user.id)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${isFollowing(user.id)
                                                    ? 'bg-gray-800 text-white hover:bg-red-500/20 hover:text-red-500 border border-gray-700'
                                                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'
                                                }`}
                                        >
                                            {isFollowing(user.id) ? 'Following' : 'Follow'}
                                        </button>
                                    )}
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No users found matching "{searchTerm}"
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
