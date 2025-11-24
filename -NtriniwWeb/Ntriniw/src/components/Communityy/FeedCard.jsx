import React from 'react';
import { FaHeart, FaComment, FaShare, FaRegHeart, FaRegComment, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FeedCard = ({ posts }) => {
    if (!posts || posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <div className="text-6xl mb-4">🏋️</div>
                <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
                <p>Follow athletes to see their latest updates.</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-8">
            {posts.map((item) => {
                // Handle both PostByFollowing (nested) and regular PostEntity (flat) structures
                const post = item.post || item;
                const user = item.user || { id: post.userId, firstName: 'User', lastName: post.userId };

                return (
                    <div key={post.id} className="bg-[#121212] rounded-3xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg shadow-black/50 group">
                        {/* Header */}
                        <div className="p-4 flex items-center justify-between">
                            <Link to={`/Profile/${user.id}`} className="flex items-center gap-3 group/user">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                                        {user.firstName && user.firstName !== 'User' ? user.firstName.charAt(0) : <FaUser />}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white group-hover/user:text-blue-400 transition-colors">
                                        {user.firstName !== 'User' ? `${user.firstName} ${user.lastName}` : `User ${user.id}`}
                                    </h3>
                                    <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}
                                    </span>
                                </div>
                            </Link>
                            <button className="text-gray-500 hover:text-white transition-colors">
                                <div className="w-1 h-1 bg-current rounded-full mb-1"></div>
                                <div className="w-1 h-1 bg-current rounded-full mb-1"></div>
                                <div className="w-1 h-1 bg-current rounded-full"></div>
                            </button>
                        </div>

                        {/* Image */}
                        {post.image && (
                            <div className="relative aspect-[4/3] bg-black">
                                <img
                                    src={post.image}
                                    alt="Post content"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        )}

                        {/* Actions & Content */}
                        <div className="p-5">
                            <div className="flex items-center gap-6 mb-4">
                                <button className="group/btn flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
                                    <div className="p-2 rounded-full group-hover/btn:bg-red-500/10 transition-colors">
                                        <FaRegHeart className="text-2xl" />
                                    </div>
                                    <span className="font-bold text-sm">{post.love ? post.love.length : 0}</span>
                                </button>

                                <button className="group/btn flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
                                    <div className="p-2 rounded-full group-hover/btn:bg-blue-500/10 transition-colors">
                                        <FaRegComment className="text-2xl" />
                                    </div>
                                    <span className="font-bold text-sm">{post.comment ? post.comment.length : 0}</span>
                                </button>

                                <button className="group/btn ml-auto text-gray-400 hover:text-green-500 transition-colors">
                                    <div className="p-2 rounded-full group-hover/btn:bg-green-500/10 transition-colors">
                                        <FaShare className="text-xl" />
                                    </div>
                                </button>
                            </div>

                            {post.content && (
                                <div className="mb-2">
                                    <span className="font-bold text-white mr-2">
                                        {user.firstName !== 'User' ? user.firstName : `User ${user.id}`}
                                    </span>
                                    <span className="text-gray-300 leading-relaxed">{post.content}</span>
                                </div>
                            )}

                            {post.comment && post.comment.length > 0 && (
                                <button className="text-gray-500 text-sm font-medium hover:text-gray-300 transition-colors">
                                    View all {post.comment.length} comments
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FeedCard;
