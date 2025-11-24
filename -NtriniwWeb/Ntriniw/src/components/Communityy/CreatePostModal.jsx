import React, { useState } from 'react';
import { FaTimes, FaImage } from 'react-icons/fa';
import AuthService from '../../services/api';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
            setError('You must be logged in to post.');
            setLoading(false);
            return;
        }

        const postData = {
            userId: currentUser.id,
            content: content,
            image: imageUrl
        };

        AuthService.createPost(postData)
            .then((response) => {
                if (response.data.status === "success") {
                    setContent('');
                    setImageUrl('');
                    onClose();
                    if (onPostCreated) onPostCreated();
                    window.location.reload(); // Simple way to refresh feed/profile
                } else {
                    setError('Failed to create post.');
                }
            })
            .catch((err) => {
                console.error("Error creating post:", err);
                setError('An error occurred.');
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 w-full max-w-lg rounded-xl border border-gray-800 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <h2 className="text-white font-bold text-lg">Create new post</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                    <div className="flex gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0"></div>
                        <textarea
                            className="bg-transparent text-white w-full resize-none focus:outline-none h-24"
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-2">Image URL</label>
                        <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                            <FaImage className="text-gray-500 mr-2" />
                            <input
                                type="text"
                                className="bg-transparent text-white w-full focus:outline-none text-sm"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {imageUrl && (
                        <div className="mb-4 rounded-lg overflow-hidden h-48 bg-black">
                            <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;
