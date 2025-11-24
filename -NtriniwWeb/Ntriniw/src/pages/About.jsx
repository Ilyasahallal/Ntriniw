import React from 'react';
import { FaBullseye, FaHandshake, FaMedal, FaUsers } from 'react-icons/fa';
import ilyasImg from '../assets/founders/ilyas.jfif';
import yazidImg from '../assets/founders/yazid.jfif';
import tahaImg from '../assets/founders/taha.png';

const About = () => {
  const team = [
    { name: "Ahallal Ilyas", role: "Co-Founder", img: ilyasImg },
    { name: "Yazid Abdelmonem Sied Ahmed", role: "Co-Founder", img: yazidImg },
    { name: "Benmalek Taha", role: "Co-Founder", img: tahaImg },
  ];

  return (
    <div className="bg-dark text-white min-h-screen font-sans pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            WE ARE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">NTRINIW</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            More than just a platform. We are a movement dedicated to empowering athletes, connecting communities, and redefining what's possible in sports.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Our Mission"
              className="rounded-2xl shadow-2xl shadow-primary/20 transform hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <FaBullseye className="text-3xl text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
            </div>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              To democratize access to elite sports training and foster a global community where every athlete, regardless of their level, has the tools and support to succeed.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              We believe that greatness is not just for the chosen few, but for anyone willing to put in the work. Ntriniw provides the bridge between ambition and achievement.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            Our Core <span className="text-secondary">Values</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl border-t-4 border-primary hover:-translate-y-2 transition-transform">
              <FaHandshake className="text-4xl text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4">Community First</h3>
              <p className="text-gray-400">
                We grow stronger together. Support, encouragement, and shared success are at the heart of everything we do.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border-t-4 border-secondary hover:-translate-y-2 transition-transform">
              <FaMedal className="text-4xl text-secondary mb-6" />
              <h3 className="text-2xl font-bold mb-4">Excellence</h3>
              <p className="text-gray-400">
                We strive for the highest quality in our workshops, coaching, and platform experience.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border-t-4 border-primary hover:-translate-y-2 transition-transform">
              <FaUsers className="text-4xl text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4">Inclusivity</h3>
              <p className="text-gray-400">
                Sports are for everyone. We are committed to creating a welcoming environment for all athletes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-12">
            Meet the <span className="text-primary">Team</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member, index) => (
              <div key={index} className="group w-64">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-700 group-hover:border-primary transition-colors mx-auto mb-4">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>

                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-primary text-sm uppercase tracking-wider">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
