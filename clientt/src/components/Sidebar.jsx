import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Sidebar = ({ isOpen }) => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  return (
    <nav
      className={`w-64 bg-gray-100 p-5 h-screen fixed left-0 top-0 z-20 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold mb-6">Text-to-Learn</h1>
        <Link to="/" className="font-bold hover:text-blue-700">My Courses</Link>
        <Link to="/create" className="font-bold hover:text-blue-700">Create New Course</Link>

        <div className="mt-auto"> {/* Pushes login/logout to the bottom */}
          {isAuthenticated ? (
            <div>
              <p className="font-semibold">{user.email}</p>
              <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="font-bold text-red-600 hover:text-red-800">
                Log Out
              </button>
            </div>
          ) : (
            <button onClick={() => loginWithRedirect()} className="font-bold text-green-600 hover:text-green-800">
              Log In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;