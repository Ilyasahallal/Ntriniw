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
        <div className="w-full min-h-screen bg-gray-50 text-gray-900 flex">
            <div className="w-[16%] border-r border-gray-200 h-screen sticky top-0 hidden lg:block bg-white">
                <LargeNav />
            </div>

            <div className="flex-1 p-8 max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900">Search Athletes</h1>
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full bg-white border border-gray-200 rounded-full py-4 pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <Link
                                    to={`/Profile/${user.id}`}
                                    key={user.id}
                                    className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-lg transition-all border border-gray-200 hover:border-cyan-500 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-cyan-600 p-[2px] shadow-md">
                                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-cyan-600 font-bold text-lg overflow-hidden">
                                                {user.firstName ? user.firstName.charAt(0) : <FaUser />}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">{user.firstName} {user.lastName}</h3>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>

                                    {currentUser && currentUser.id !== user.id && (
                                        <button
                                            onClick={(e) => isFollowing(user.id) ? handleUnfollow(e, user.id) : handleFollow(e, user.id)}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${isFollowing(user.id)
                                                ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-red-300 hover:text-red-500'
                                                : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-md hover:shadow-lg'
                                                }`}
                                        >
                                            {isFollowing(user.id) ? 'Following' : 'Follow'}
                                        </button>
                                    )}
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                <div className="text-5xl mb-3">🔍</div>
                                <p className="text-lg font-semibold text-gray-700 mb-1">No users found</p>
                                {searchTerm && <p className="text-sm">Try searching with a different term</p>}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
