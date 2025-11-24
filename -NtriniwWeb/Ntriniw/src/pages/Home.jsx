import React from 'react';
import { FaRunning, FaDumbbell, FaUsers, FaArrowRight, FaFire } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-dark text-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Sports Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/80"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              UNLEASH
            </span> YOUR <br /> POTENTIAL
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the ultimate community for athletes. Train harder, recover faster, and connect with champions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/Login" className="px-8 py-4 bg-primary text-dark font-bold text-lg rounded-full hover:bg-white transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              Get Started <FaArrowRight />
            </Link>
            <Link to="/Workshops" className="px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white hover:text-dark transition-all">
              Explore Workshops
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose <span className="text-primary">Ntriniw</span>?</h2>
            <p className="text-gray-400">Everything you need to elevate your game.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800/50 p-8 rounded-2xl hover:bg-gray-800 transition-all border border-gray-700 hover:border-primary group">
              <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <FaDumbbell className="text-2xl text-primary group-hover:text-dark" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Workshops</h3>
              <p className="text-gray-400">Access exclusive training sessions led by world-class coaches and athletes.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800/50 p-8 rounded-2xl hover:bg-gray-800 transition-all border border-gray-700 hover:border-secondary group">
              <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors">
                <FaUsers className="text-2xl text-secondary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Vibrant Community</h3>
              <p className="text-gray-400">Connect with like-minded sports enthusiasts, share progress, and stay motivated.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800/50 p-8 rounded-2xl hover:bg-gray-800 transition-all border border-gray-700 hover:border-primary group">
              <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <FaFire className="text-2xl text-primary group-hover:text-dark" />
              </div>
              <h3 className="text-xl font-bold mb-3">Daily Challenges</h3>
              <p className="text-gray-400">Push your limits with daily fitness challenges and track your leaderboard status.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-dark border-y border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-primary font-medium">Active Members</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50+</div>
              <div className="text-secondary font-medium">Workshops</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">120</div>
              <div className="text-primary font-medium">Pro Coaches</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-secondary font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 p-12 rounded-3xl border border-white/10 backdrop-blur-sm">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-300 mb-8">Join Ntriniw today and transform the way you train.</p>
          <Link to="/Login" className="inline-block px-10 py-4 bg-white text-dark font-bold text-xl rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg shadow-primary/25">
            Join Now - It's Free
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;