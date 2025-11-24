import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaBars, FaTimes } from "react-icons/fa";
import LogoNtriniw from "../images/logontriniw.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', link: 'Home' },
    { path: '/About', link: 'About' }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-dark/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <nav className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={LogoNtriniw} alt="Ntriniw" className="w-24 md:w-32 h-auto object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${location.pathname === item.path
                  ? 'text-primary'
                  : 'text-gray-300 hover:text-white'
                }`}
            >
              {item.link}
            </Link>
          ))}
        </div>

        {/* Actions & Socials */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-4 text-gray-400">
            <a href="https://www.instagram.com/ntriniw/" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors"><FaInstagram size={20} /></a>
            <a href="#" className="hover:text-blue-500 transition-colors"><FaFacebook size={20} /></a>
          </div>
          <Link to="/Login">
            <button className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all transform hover:scale-105">
              Log In
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-dark border-t border-gray-800 shadow-xl">
          <div className="flex flex-col p-4 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-center py-2 font-bold ${location.pathname === item.path ? 'text-primary' : 'text-white'
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.link}
              </Link>
            ))}
            <div className="flex justify-center gap-6 py-4 border-t border-gray-800 mt-2">
              <a href="https://www.instagram.com/ntriniw/" className="text-gray-400 hover:text-secondary"><FaInstagram size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-500"><FaFacebook size={24} /></a>
            </div>
            <Link to="/Login" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full bg-primary text-dark py-3 rounded-lg font-bold">
                Log In
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;