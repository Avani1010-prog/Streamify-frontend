import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar"; // ✅ Added missing import

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* ✅ Conditionally render Sidebar */}
        {showSidebar && <Sidebar />}

        {/* ✅ Main content area */}
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto p-4">
            {children} {/* ✅ Removed duplicate */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
