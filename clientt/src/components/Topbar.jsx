import React from 'react';

// The 'toggleSidebar' function will be passed in as a prop from App.jsx
const Topbar = ({ toggleSidebar }) => {
  return (
    <div className="md:hidden flex justify-between items-center p-4 bg-gray-800 text-white fixed top-0 left-0 right-0 z-10">
      <h1 className="text-xl font-bold">Text-to-Learn</h1>
      <button onClick={toggleSidebar}>
        {/* Simple hamburger icon */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>
  );
};

export default Topbar;