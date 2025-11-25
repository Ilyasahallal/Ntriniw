import React, { useState, useEffect } from 'react';
import AuthService from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCog, FaTh, FaUser, FaBookmark, FaSignOutAlt } from 'react-icons/fa';
import EditProfileModal from '../components/Communityy/EditProfileModal';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();
    const { userId } = useParams();

    useEffect(() => {
        const loggedInUser = AuthService.getCurrentUser();
        if (!loggedInUser) {
            navigate('/login');
            return;
        }
        setCurrentUser(loggedInUser);

        const targetUserId = userId || loggedInUser.id;

        // Fetch full profile data
        AuthService.getProfile(targetUserId)
            .then((response) => {
                if (response.data.status === "success") {
                    setUser(response.data.payload);
                    // Check if following
                    if (loggedInUser.following && loggedInUser.following.includes(targetUserId)) {
                        setIsFollowing(true);
                    }
                }
            })
            .catch((err) => console.error("Error fetching profile:", err));

        // Fetch user posts
        AuthService.getMyPosts(targetUserId)
            .then((response) => {
                if (response.data.status === "success") {
                    setPosts(response.data.payload || []);
                }
            })
            .catch((err) => console.error("Error fetching posts:", err))
            .finally(() => setLoading(false));
    }, [navigate, userId]);

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
        window.location.reload();
    };

    const handleFollow = () => {
        if (!user || !currentUser) return;
        AuthService.followUser(user.id, currentUser.id)
            .then(() => {
                setIsFollowing(true);
                // Update local storage for current user to reflect new following
                const updatedUser = { ...currentUser, following: [...(currentUser.following || []), user.id] };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
            })
            .catch(err => console.error("Error following user:", err));
    };

    const handleUnfollow = () => {
        if (!user || !currentUser) return;
        AuthService.unfollowUser(user.id, currentUser.id)
            .then(() => {
                setIsFollowing(false);
                // Update local storage
                const updatedFollowing = (currentUser.following || []).filter(id => id !== user.id);
                const updatedUser = { ...currentUser, following: updatedFollowing };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
            })
            .catch(err => console.error("Error unfollowing user:", err));
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">User not found</div>;
    }

    const isOwnProfile = currentUser && user.id === currentUser.id;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 border-b border-gray-200 pb-12">
                    {/* Avatar */}
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-cyan-400 via-cyan-500 to-cyan-600 p-[3px] shadow-xl">
                        <div className="w-full h-full rounded-full bg-white p-1">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-4xl font-bold text-cyan-600 overflow-hidden">
                                {user.firstName?.charAt(0)}
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                            <h1 className="text-2xl font-semibold text-gray-900">{user.email.split('@')[0]}</h1>
                            <div className="flex gap-2">
                                {isOwnProfile ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditModalOpen(true)}
                                            className="bg-cyan-600 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-cyan-500 transition-all shadow-md hover:shadow-lg"
                                        >
                                            Edit Profile
                                        </button>
                                        <button className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm">
                                            View Archive
                                        </button>
                                        <button onClick={handleLogout} className="text-gray-600 p-2 hover:text-red-500 transition-colors" title="Logout">
                                            <FaSignOutAlt className="text-xl" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={isFollowing ? handleUnfollow : handleFollow}
                                            className={`${isFollowing ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-cyan-600 text-white hover:bg-cyan-500'} px-6 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg`}
                                        >
                                            {isFollowing ? 'Unfollow' : 'Follow'}
                                        </button>
                                        <button
                                            onClick={() => navigate('/messages', { state: { targetUser: user } })}
                                            className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm"
                                        >
                                            Message
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-center md:justify-start gap-8 mb-4 text-base">
                            <div><span className="font-bold text-gray-900">{posts.length}</span> <span className="text-gray-600">posts</span></div>
                            <div><span className="font-bold text-gray-900">{user.follower ? user.follower.length : 0}</span> <span className="text-gray-600">followers</span></div>
                            <div><span className="font-bold text-gray-900">{user.following ? user.following.length : 0}</span> <span className="text-gray-600">following</span></div>
                        </div>

                        {/* Bio */}
                        <div className="text-sm">
                            <div className="font-bold mb-1 text-gray-900">{user.firstName} {user.lastName}</div>
                            <p className="text-gray-600">
                                Athlete | Fitness Enthusiast <br />
                                Welcome to my Ntriniw profile!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-12 border-t border-gray-200 -mt-[1px] mb-8">
                    <button className="flex items-center gap-2 py-4 border-t-2 border-cyan-600 text-xs font-bold tracking-widest uppercase text-gray-900">
                        <FaTh /> Posts
                    </button>
                    <button className="flex items-center gap-2 py-4 border-t-2 border-transparent text-gray-500 text-xs font-bold tracking-widest uppercase hover:text-gray-700 transition-colors">
                        <FaBookmark /> Saved
                    </button>
                    <button className="flex items-center gap-2 py-4 border-t-2 border-transparent text-gray-500 text-xs font-bold tracking-widest uppercase hover:text-gray-700 transition-colors">
                        <FaUser /> Tagged
                    </button>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-3 gap-1 md:gap-4">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.id} className="aspect-square bg-white relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all">
                                {post.image ? (
                                    <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex gap-6 text-white font-bold">
                                        <span>❤️ {post.likes || 0}</span>
                                        <span>💬 {post.comments || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 py-20 text-center text-gray-500">
                            <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTh className="text-2xl text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Posts Yet</h2>
                            <p>Start capturing and sharing your moments.</p>
                        </div>
                    )}
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
            />
        </div>
    );
};

export default Profile;
