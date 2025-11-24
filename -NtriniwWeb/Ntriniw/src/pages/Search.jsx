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

    useEffect(() => {
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
                                    className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors border border-gray-800 hover:border-blue-500/50"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px]">
                                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white font-bold">
                                            {user.firstName ? user.firstName.charAt(0) : <FaUser />}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{user.firstName} {user.lastName}</h3>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
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
