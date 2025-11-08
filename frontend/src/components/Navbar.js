import React from 'react';
import { FaBriefcase } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center justify-center">
          <FaBriefcase className="text-3xl mr-3" />
          <h1 className="text-3xl font-bold">SkillLink</h1>
        </div>
        <p className="text-center mt-2 text-blue-100">
          AI-Powered Resume Analyzer & Job Matcher
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
