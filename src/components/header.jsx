import React from "react";
import "../styles/header.css";
import useDeviceType from "./usewindowsize";
import {LogoutComponent} from "./logout";

function Header({ toggleSidebar }) {
  const { isMobile } = useDeviceType();
  return (
    <div className="header">
      {isMobile && (
        <button className="menu-btn" onClick={toggleSidebar}>
          ☰
        </button>
      )}
      <h3 className="header-title">QPAY MASTER</h3>
      <LogoutComponent/>
    </div>
  );
}

export default Header;
