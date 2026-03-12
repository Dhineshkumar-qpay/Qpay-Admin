import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/header.jsx";
import Sidebar from "../../components/sidebar.jsx";
import "../../styles/layout.css";
import useDeviceType from "../../components/usewindowsize.js";

function MainDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isMobile } = useDeviceType();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    if (isMobile) setIsSidebarOpen(false);
  };

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="main-section">
        <Header toggleSidebar={toggleSidebar} />

        <div className="content" onClick={closeSidebar}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainDashboard;