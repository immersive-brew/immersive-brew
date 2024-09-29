'use client';

import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <nav className="navbar">
      <motion.div
        className="nav-links"
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      >
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/journal">Journal</a>
        <a href="/community">Community</a>
        <a href="/profile">Profile</a>
        <a href="/services">Services</a>
        <a href="/contact">Contact</a>
      </motion.div>

      <style jsx>{`
        .navbar {
          position: relative;
          background-color: #333;
          padding: 10px;
          color: white;
        }

        .nav-links {
          display: flex;
          flex-direction: column;
          background-color: #333;
          padding: 20px;
          width: 200px;
        }

        .nav-links a {
          color: white;
          text-decoration: none;
          padding: 10px 0;
          font-size: 18px;
        }

        .nav-links a:hover {
          color: #aaa;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
