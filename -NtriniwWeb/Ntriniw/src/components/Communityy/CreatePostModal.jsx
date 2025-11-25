import React, { useState } from 'react';
import ReactDOM from 'react-dom';
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

        // Validation: au moins du contenu ou une image
        if (!content.trim() && !imageUrl.trim()) {
            setError('Please add some content or an image.');
            return;
        }

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
            content: content.trim(),
            image: imageUrl.trim() || null
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

    const modalContent = (
        <div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{
                zIndex: 999999,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }}
        >
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            ></div>
            <div
                className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200 relative"
                style={{ position: 'relative', zIndex: 1 }}
            >
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h2 className="text-gray-900 font-bold text-xl">Create new post</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5">
                    {error && <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}

                    <div className="flex gap-4 mb-5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-cyan-600 flex-shrink-0 flex items-center justify-center text-white font-bold">
                            {AuthService.getCurrentUser()?.firstName?.charAt(0) || 'U'}
                        </div>
                        <textarea
                            className="bg-gray-50 text-gray-900 w-full resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg p-3 border border-gray-200 h-28"
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Image URL <span className="text-gray-500 font-normal">(optional)</span>
                        </label>
                        <div className="flex items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-transparent transition-all">
                            <FaImage className="text-gray-400 mr-3" />
                            <input
                                type="text"
                                className="bg-transparent text-gray-900 w-full focus:outline-none text-sm"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </div>
                    </div>

                    {imageUrl && (
                        <div className="mb-5 rounded-xl overflow-hidden h-48 bg-gray-100 border border-gray-200">
                            <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" onError={(e) => {
                                e.target.style.display = 'none';
                                setError('Invalid image URL');
                            }} />
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || (!content.trim() && !imageUrl.trim())}
                            className="bg-cyan-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    // Use React Portal to render modal at the root level
    return ReactDOM.createPortal(
        modalContent,
        document.body
    );
};

export default CreatePostModal;
