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
        <div className="w-full min-h-screen bg-gray-50 text-gray-900 flex">
            <div className="w-[16%] border-r border-gray-200 h-screen sticky top-0 hidden lg:block bg-white">
                <LargeNav />
            </div>

            <div className="flex-1 flex h-screen">
                <div className="w-1/3 border-r border-gray-200 flex flex-col bg-white">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length > 0 ? (
                            conversations.map(user => (
                                <div
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${selectedUser?.id === user.id ? 'bg-cyan-50 border-cyan-600' : 'border-transparent'}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-cyan-600 p-[2px] shadow-md">
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-cyan-600 font-bold">
                                            {user.firstName ? user.firstName.charAt(0) : <FaUser />}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate">{user.firstName} {user.lastName}</h3>
                                        <p className="text-sm text-gray-500 truncate">Click to chat</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-gray-500">
                                <div className="text-4xl mb-3">💬</div>
                                <p className="text-sm">No conversations yet. Search for a user to start chatting!</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-white">
                    {selectedUser ? (
                        <>
                            <div className="p-5 border-b border-gray-200 flex items-center gap-4 bg-white shadow-sm sticky top-0 z-10">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-400 to-cyan-600 p-[2px] shadow-md">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-cyan-600 font-bold">
                                        {selectedUser.firstName ? selectedUser.firstName.charAt(0) : <FaUser />}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</h3>
                                    <p className="text-xs text-gray-500">Active now</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                                {messages.map((msg, index) => {
                                    const isOwn = msg.senderId === currentUser.id;
                                    return (
                                        <div key={index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                            <div
                                                className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm ${isOwn
                                                    ? 'bg-cyan-600 text-white rounded-br-md'
                                                    : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                                                    }`}
                                            >
                                                <p className="leading-relaxed">{msg.content}</p>
                                                <span className={`text-xs mt-2 block ${isOwn ? 'text-cyan-100' : 'text-gray-500'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-5 border-t border-gray-200 bg-white">
                                <form onSubmit={handleSendMessage} className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="bg-cyan-600 text-white p-4 rounded-full hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                                    >
                                        <FaPaperPlane />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                            <div className="text-6xl mb-4">💬</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Your Messages</h3>
                            <p>Select a conversation to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
