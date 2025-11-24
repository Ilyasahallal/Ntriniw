import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaUser } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import AuthService from '../services/api';
import LargeNav from '../components/Communityy/LargeNav';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            fetchConversations(user.id);
        }
    }, []);

    useEffect(() => {
        if (location.state?.targetUser && conversations) {
            const target = location.state.targetUser;
            const exists = conversations.find(u => u.id === target.id);
            if (!exists) {
                setConversations(prev => [target, ...prev]);
            }
            setSelectedUser(target);
        }
    }, [location.state, conversations.length]);

    useEffect(() => {
        if (currentUser && selectedUser) {
            fetchMessages(currentUser.id, selectedUser.id);
            const interval = setInterval(() => {
                fetchMessages(currentUser.id, selectedUser.id);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [currentUser, selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = (userId) => {
        AuthService.getRecentConversations(userId)
            .then(response => {
                if (response.data.status === "success") {
                    setConversations(response.data.payload || []);
                }
            })
            .catch(err => console.error("Error fetching conversations:", err));
    };

    const fetchMessages = (userId1, userId2) => {
        AuthService.getConversation(userId1, userId2)
            .then(response => {
                if (response.data.status === "success") {
                    setMessages(response.data.payload || []);
                }
            })
            .catch(err => console.error("Error fetching messages:", err));
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser || !selectedUser) return;

        AuthService.sendMessage(currentUser.id, selectedUser.id, newMessage)
            .then(response => {
                if (response.data.status === "success") {
                    setMessages([...messages, response.data.payload]);
                    setNewMessage('');
                    fetchConversations(currentUser.id);
                }
            })
            .catch(err => console.error("Error sending message:", err));
    };

    return (
        <div className="w-full min-h-screen bg-black text-white flex">
            <div className="w-[16%] border-r border-gray-800 h-screen sticky top-0 hidden lg:block">
                <LargeNav />
            </div>

            <div className="flex-1 flex h-screen">
                <div className="w-1/3 border-r border-gray-800 flex flex-col">
                    <div className="p-6 border-b border-gray-800">
                        <h2 className="text-xl font-bold">Messages</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length > 0 ? (
                            conversations.map(user => (
                                <div
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-900 transition-colors ${selectedUser?.id === user.id ? 'bg-gray-900' : ''}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px]">
                                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white font-bold">
                                            {user.firstName ? user.firstName.charAt(0) : <FaUser />}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{user.firstName} {user.lastName}</h3>
                                        <p className="text-sm text-gray-500">Click to chat</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-gray-500">
                                No conversations yet. Search for a user to start chatting!
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    {selectedUser ? (
                        <>
                            <div className="p-4 border-b border-gray-800 flex items-center gap-4 bg-black/50 backdrop-blur-md sticky top-0 z-10">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white font-bold">
                                        {selectedUser.firstName ? selectedUser.firstName.charAt(0) : <FaUser />}
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg">{selectedUser.firstName} {selectedUser.lastName}</h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg, index) => {
                                    const isOwn = msg.senderId === currentUser.id;
                                    return (
                                        <div key={index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                            <div
                                                className={`max-w-[70%] px-4 py-2 rounded-2xl ${isOwn
                                                        ? 'bg-blue-600 text-white rounded-br-none'
                                                        : 'bg-gray-800 text-white rounded-bl-none'
                                                    }`}
                                            >
                                                <p>{msg.content}</p>
                                                <span className="text-xs opacity-70 mt-1 block">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 border-t border-gray-800">
                                <form onSubmit={handleSendMessage} className="flex gap-4">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-gray-900 border border-gray-800 rounded-full px-6 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <FaPaperPlane />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                            <div className="text-6xl mb-4">💬</div>
                            <h3 className="text-xl font-bold text-white mb-2">Your Messages</h3>
                            <p>Select a conversation to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
