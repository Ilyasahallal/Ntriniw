import React, { useState, useEffect } from 'react';
import AuthService from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FaCog, FaTh, FaUser, FaBookmark, FaSignOutAlt } from 'react-icons/fa';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }

        // Fetch full profile data
        AuthService.getProfile(currentUser.id)
            .then((response) => {
                if (response.data.status === "success") {
                    setUser(response.data.payload);
                }
            })
            .catch((err) => console.error("Error fetching profile:", err));

        // Fetch user posts
        AuthService.getMyPosts(currentUser.id)
            .then((response) => {
                if (response.data.status === "success") {
                    setPosts(response.data.payload || []);
                }
            })
            .catch((err) => console.error("Error fetching posts:", err))
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
        window.location.reload();
    };

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">User not found</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 border-b border-gray-800 pb-12">
                    {/* Avatar */}
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-black p-1">
                            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-4xl font-bold overflow-hidden">
                                {user.firstName?.charAt(0)}
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                            <h1 className="text-2xl font-light">{user.email.split('@')[0]}</h1>
                            <div className="flex gap-2">
                                <button className="bg-white text-black px-4 py-1.5 rounded font-semibold text-sm hover:bg-gray-200 transition-colors">
                                    Edit Profile
                                </button>
                                <button className="bg-gray-800 px-4 py-1.5 rounded font-semibold text-sm hover:bg-gray-700 transition-colors">
                                    View Archive
                                </button>
                                <button onClick={handleLogout} className="text-white p-2 hover:text-red-500 transition-colors" title="Logout">
                                    <FaSignOutAlt className="text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-center md:justify-start gap-8 mb-4 text-base">
                            <div><span className="font-bold">{posts.length}</span> posts</div>
                            <div><span className="font-bold">0</span> followers</div>
                            <div><span className="font-bold">0</span> following</div>
                        </div>

                        {/* Bio */}
                        <div className="text-sm">
                            <div className="font-bold mb-1">{user.firstName} {user.lastName}</div>
                            <p className="text-gray-300">
                                Athlete | Fitness Enthusiast <br />
                                Welcome to my Ntriniw profile!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-12 border-t border-gray-800 -mt-[1px] mb-8">
                    <button className="flex items-center gap-2 py-4 border-t border-white text-xs font-bold tracking-widest uppercase">
                        <FaTh /> Posts
                    </button>
                    <button className="flex items-center gap-2 py-4 border-t border-transparent text-gray-500 text-xs font-bold tracking-widest uppercase hover:text-gray-300">
                        <FaBookmark /> Saved
                    </button>
                    <button className="flex items-center gap-2 py-4 border-t border-transparent text-gray-500 text-xs font-bold tracking-widest uppercase hover:text-gray-300">
                        <FaUser /> Tagged
                    </button>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-3 gap-1 md:gap-8">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.id} className="aspect-square bg-gray-800 relative group cursor-pointer overflow-hidden">
                                {post.image ? (
                                    <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gray-900">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex gap-6 text-white font-bold">
                                        <span>❤️ {post.likes || 0}</span>
                                        <span>💬 {post.comments || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 py-20 text-center text-gray-500">
                            <div className="w-16 h-16 border-2 border-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTh className="text-2xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">No Posts Yet</h2>
                            <p>Start capturing and sharing your moments.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
