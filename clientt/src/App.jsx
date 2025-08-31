import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      <Toaster position="top-center" />
      <Topbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />

      {/* Add padding-top on mobile to avoid content being hidden by the topbar */}
      <main className="flex-1 pt-16 md:pt-8 md:ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default App;