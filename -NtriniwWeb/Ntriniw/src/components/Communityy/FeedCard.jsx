import React from 'react';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';

const FeedCard = ({ posts }) => {
    if (!posts || posts.length === 0) {
        return <div className="text-white text-center">No posts to show. Follow some users!</div>;
    }

    return (
        <div className="w-full flex flex-col gap-6">
            {posts.map((post) => (
                <div key={post.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        {/* Placeholder for user avatar if not in post data */}
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                            {post.userId ? "U" : "?"}
                        </div>
                        <div>
                            <h3 className="font-bold text-white">User {post.userId}</h3>
                            <span className="text-gray-400 text-xs">{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {post.image && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                            <img src={post.image} alt="Post" className="w-full h-auto object-cover" />
                        </div>
                    )}

                    <div className="flex items-center gap-6 text-gray-300 mb-3">
                        <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                            <FaHeart /> <span>{post.likes || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                            <FaComment /> <span>{post.comments || 0}</span>
                        </button>
                        <button className="hover:text-green-500 transition-colors">
                            <FaShare />
                        </button>
                    </div>

                    <p className="text-gray-300">
                        <span className="font-bold text-white mr-2">User {post.userId}</span>
                        {post.caption}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default FeedCard;
