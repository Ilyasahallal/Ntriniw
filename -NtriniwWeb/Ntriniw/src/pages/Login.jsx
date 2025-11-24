import React, { useState, useEffect } from 'react';
import { FaUserAlt, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/api';

const Login = () => {
  const [action, setAction] = useState("Login");
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      navigate('/community');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    try {
      if (action === "Sign Up") {
        await AuthService.register(formData.firstName, formData.lastName, formData.email, formData.password);
        setAction("Login");
        alert("Registration successful! Please login.");
      } else {
        await AuthService.login(formData.email, formData.password);
        navigate('/community');
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary rounded-full blur-[150px]"></div>
      </div>

      <div className="bg-gray-900/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            {action}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="flex flex-col gap-6">
          {action === "Sign Up" && (
            <>
              <div className="relative group">
                <FaUserAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white pl-12 pr-4 py-4 rounded-xl border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div className="relative group">
                <FaUserAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white pl-12 pr-4 py-4 rounded-xl border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </>
          )}

          <div className="relative group">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white pl-12 pr-4 py-4 rounded-xl border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="relative group">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white pl-12 pr-4 py-4 rounded-xl border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>

        {action === "Login" && (
          <div className="text-right mt-4">
            <span className="text-gray-400 text-sm hover:text-primary cursor-pointer transition-colors">
              Lost Password?
            </span>
          </div>
        )}

        <div className="mt-10 flex gap-4">
          <button
            className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${action === "Sign Up"
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 transform scale-105"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            onClick={() => {
              if (action === "Sign Up") handleSubmit();
              else setAction("Sign Up");
            }}
          >
            Sign Up
          </button>
          <button
            className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${action === "Login"
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 transform scale-105"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            onClick={() => {
              if (action === "Login") handleSubmit();
              else setAction("Login");
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
