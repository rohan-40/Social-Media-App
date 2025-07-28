import React, { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";
import { Menu } from "lucide-react";

const MainLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // ✅ Close mobile drawer when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMobileSidebarOpen(false);
      }
    };
    if (mobileSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="w-full overflow-x-hidden flex">
      {/* ✅ Mobile Hamburger Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="bg-white p-2 rounded-md shadow-md"
        >
          <Menu />
        </button>
      </div>

      {/* ✅ Desktop Sidebar (always visible on md+) */}
      <div className="hidden md:block fixed top-0 left-0 w-[16%] h-screen border-r border-gray-300 bg-white z-30">
        <LeftSidebar />
      </div>

      {/* ✅ Mobile Sidebar (drawer) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40">
          <div
            ref={sidebarRef}
            className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-4 overflow-y-auto"
          >
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="mb-4 text-sm text-gray-500 hover:underline"
            >
              Close
            </button>
            <LeftSidebar isMobile />
          </div>
        </div>
      )}

      {/* ✅ Main Content */}
      <div className="flex-1 w-full pt-16 md:pt-0 md:ml-[16%]">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
