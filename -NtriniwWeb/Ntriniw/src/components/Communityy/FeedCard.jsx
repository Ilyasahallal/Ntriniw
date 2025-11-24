import React from 'react';
import instagramFeed from './FeedData';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';

const FeedCard = () => {
    return (
        <div className="w-full flex flex-col gap-6">
            {instagramFeed.map((feed) => (
                <div key={feed.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <img src={feed.profileImg} alt={feed.username} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <h3 className="font-bold text-white">{feed.username}</h3>
                            <span className="text-gray-400 text-xs">{feed.time}</span>
                        </div>
                    </div>

                    <div className="mb-4 rounded-lg overflow-hidden">
                        <img src={feed.postImg} alt="Post" className="w-full h-auto object-cover" />
                    </div>

                    <div className="flex items-center gap-6 text-gray-300 mb-3">
                        <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                            <FaHeart /> <span>{feed.likeCount}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                            <FaComment /> <span>{feed.commentCount}</span>
                        </button>
                        <button className="hover:text-green-500 transition-colors">
                            <FaShare />
                        </button>
                    </div>

                    <p className="text-gray-300">
                        <span className="font-bold text-white mr-2">{feed.username}</span>
                        {feed.caption}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default FeedCard;
