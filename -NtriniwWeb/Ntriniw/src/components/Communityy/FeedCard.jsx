import React, { useState } from 'react';
import { FaHeart, FaComment, FaShare, FaRegHeart, FaRegComment, FaUser, FaPaperPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AuthService from '../../services/api';

const PostItem = ({ item }) => {
    const post = item.post || item;
    const user = item.user || { id: post.userId, firstName: 'User', lastName: post.userId };
    const currentUser = AuthService.getCurrentUser();

    const [isLiked, setIsLiked] = useState(post.love ? post.love.includes(currentUser?.id) : false);
    const [likesCount, setLikesCount] = useState(post.love ? post.love.length : 0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(post.comment || []);
    const [newComment, setNewComment] = useState('');

    const handleLike = () => {
        if (!currentUser) return;

        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);

        AuthService.lovePost(post.id, currentUser.id)
            .catch(err => {
                console.error("Error liking post:", err);
                setIsLiked(!newIsLiked);
                setLikesCount(prev => !newIsLiked ? prev + 1 : prev - 1);
            });
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;

        const tempComment = {
            id: Date.now().toString(),
            userId: currentUser.id,
            userFullname: `${currentUser.firstName} ${currentUser.lastName}`,
            content: newComment,
            createdAt: new Date().toISOString()
        };

        setComments([...comments, tempComment]);
        setNewComment('');

        AuthService.commentPost(post.id, currentUser.id, `${currentUser.firstName} ${currentUser.lastName}`, tempComment.content)
            .then(response => {
                if (response.data.status === "success") {
                    // Optionally update with server response if needed
                }
            })
            .catch(err => {
                console.error("Error commenting:", err);
                setComments(comments); // Revert
            });
    };

    return (
        <div className="bg-[#121212] rounded-3xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg shadow-black/50 group">
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
                    <button
                        onClick={handleLike}
                        className={`group/btn flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors`}
                    >
                        <div className={`p-2 rounded-full group-hover/btn:bg-red-500/10 transition-colors`}>
                            {isLiked ? <FaHeart className="text-2xl" /> : <FaRegHeart className="text-2xl" />}
                        </div>
                        <span className="font-bold text-sm">{likesCount}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`group/btn flex items-center gap-2 ${showComments ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'} transition-colors`}
                    >
                        <div className="p-2 rounded-full group-hover/btn:bg-blue-500/10 transition-colors">
                            {showComments ? <FaComment className="text-2xl" /> : <FaRegComment className="text-2xl" />}
                        </div>
                        <span className="font-bold text-sm">{comments.length}</span>
                    </button>

                    <button className="group/btn ml-auto text-gray-400 hover:text-green-500 transition-colors">
                        <div className="p-2 rounded-full group-hover/btn:bg-green-500/10 transition-colors">
                            <FaShare className="text-xl" />
                        </div>
                        <span className="font-bold text-sm">{post.share ? post.share.length : 0}</span>
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

                {/* Comments Section */}
                {showComments && (
                    <div className="mt-4 border-t border-gray-800 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="max-h-60 overflow-y-auto space-y-3 mb-4 custom-scrollbar">
                            {comments.map((comment, idx) => (
                                <div key={idx} className="bg-gray-900/50 p-3 rounded-lg">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-sm text-blue-400">{comment.userFullname}</span>
                                        <span className="text-xs text-gray-500">
                                            {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-300">{comment.content}</p>
                                </div>
                            ))}
                            {comments.length === 0 && (
                                <p className="text-center text-gray-500 text-sm py-2">No comments yet. Be the first!</p>
                            )}
                        </div>

                        <form onSubmit={handleCommentSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 bg-gray-800 border-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500 disabled:opacity-50 transition-colors"
                            >
                                <FaPaperPlane size={14} />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

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
            {posts.map((item) => (
                <PostItem key={item.post?.id || item.id} item={item} />
            ))}
        </div>
    );
};

export default FeedCard;
