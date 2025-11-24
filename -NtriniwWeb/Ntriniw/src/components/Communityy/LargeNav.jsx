import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaCompass, FaVideo, FaFacebookMessenger, FaHeart, FaPlus, FaUser, FaSignOutAlt } from 'react-icons/fa';
import LogoNtriniw from "../../images/logontriniw.png"
import AuthService from '../../services/api';
import CreatePostModal from './CreatePostModal';

const LargeNav = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
    window.location.reload();
  };

  const sidebarItems = [
    {
      name: "Search",
      link: "/search",
      icon: FaSearch,
    },
    {
      name: "Explore",
      link: "/explore",
      icon: FaCompass,
    },
    {
      name: "Reels",
      link: "/reels",
      icon: FaVideo,
    },
    {
      name: "Messages",
      link: "/messages",
      icon: FaFacebookMessenger,
    },
    {
      name: "Notifications",
      link: "/notifications",
      icon: FaHeart,
    },
    {
      name: "Create",
      link: "#", // Changed to # since it opens a modal
      icon: FaPlus,
      action: () => setIsCreateModalOpen(true)
    },
    {
      name: "Profile",
      link: "/Profile",
      icon: FaUser,
    },
  ];
  return (
    <>
      <div className="w-full h-full relative bg-white flex flex-col">
        <Link to="/Community" className="mb-4 px-2 py-2 block">
          <img src={LogoNtriniw} alt="Ntriniw" className="w-28 h-auto" />
        </Link>

        <div className="mt-4 flex-1">
          {sidebarItems.map((item) => (
            item.action ? (
              <button
                key={item.name}
                onClick={item.action}
                className="flex gap-4 p-2 text-black hover:bg-cyan-600 rounded-lg mb-2 w-full text-left"
              >
                <item.icon className="w-6 h-6" />
                <span>{item.name}</span>
              </button>
            ) : (
              <Link to={item.link} key={item.name} className="flex gap-4 p-2 text-black hover:bg-cyan-600 rounded-lg mb-2">
                <item.icon className="w-6 h-6" />
                <span>{item.name}</span>
              </Link>
            )
          ))}
        </div>

        <div className="mt-auto mb-4">
          <button onClick={handleLogout} className="flex gap-4 p-2 text-black hover:bg-red-500 hover:text-white rounded-lg w-full text-left transition-colors">
            <FaSignOutAlt className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  )
}

export default LargeNav