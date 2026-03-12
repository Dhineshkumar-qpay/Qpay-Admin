import React from "react";
import "../styles/sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import AppRoutes from "../utils/app_routes";

function ExpansionMenu({ title, icon, isOpen, children = [], onClick }) {
  return (
    <li className="expansion-menu">
      <div className="expansion-menu-title" onClick={onClick}>
        <img
          src={icon}
          alt={`Icon-${title}`}
          height={18}
          width={18}
          style={{ marginRight: 10 }}
        />
        {title} <span style={{ flex: 1 }}></span>
        <p style={{ fontSize: 10, textAlign: "center", marginLeft: 15 }}>
          {isOpen ? " ▲ " : " ▼ "}
        </p>
      </div>

      {isOpen && <div className="expansion-menu-content">{children}</div>}
    </li>
  );
}

function NaviLink({ label, icon = null, onClick, isActive }) {
  return (
    <li className={`nav-link ${isActive ? "active" : ""}`} onClick={onClick}>
      {icon && (
        <img
          src={icon}
          alt={`Icon-${label}`}
          height={18}
          width={18}
          style={{ marginRight: 10, marginLeft: 4 }}
        />
      )}
      <p style={{ marginLeft: icon ? "0" : "8px" }}> {label}</p>
    </li>
  );
}

function Sidebar({ isOpen, onItemClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = React.useState(null);

  const toggleSubmenu = (menu) => {
    setOpenSubmenu((prev) => (prev === menu ? null : menu));
  };

  const handleNavigate = (route) => {
    navigate(route);
    if (onItemClick) onItemClick();
  };

  // Automatically open the submenu if one of its children is active
  React.useEffect(() => {
    const path = location.pathname;
    if (path === AppRoutes.employees) setOpenSubmenu("employee");
    else if (path === AppRoutes.clients) setOpenSubmenu("client");
    else if (path === AppRoutes.projects || path === AppRoutes.projectModule)
      setOpenSubmenu("project");
    else if (path === AppRoutes.assignProject) setOpenSubmenu("assignment");
    else if (path === AppRoutes.workreports) setOpenSubmenu("workReports");
    else if (path === AppRoutes.summmary) setOpenSubmenu("summary");
  }, [location.pathname]);

  return (
    <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
      <div className="sidebar-logo-container">
        <img
          src="https://www.qpayindia.com/img/qpaylogo.png"
          alt="QPay India Logo"
        />
      </div>

      <div className="sidebar-menu">
        <ul>
          <NaviLink
            label="Dashboard"
            icon={"https://cdn-icons-png.flaticon.com/128/17045/17045269.png"}
            isActive={location.pathname === AppRoutes.dashboard}
            onClick={() => {
              handleNavigate(AppRoutes.dashboard);
            }}
          />

          <ExpansionMenu
            title="Employee Master"
            icon={"https://cdn-icons-png.flaticon.com/128/3601/3601166.png"}
            isOpen={openSubmenu === "employee"}
            onClick={() => toggleSubmenu("employee")}
          >
            <ul>
              <NaviLink
                label="Employees"
                isActive={location.pathname === AppRoutes.employees}
                onClick={() => {
                  handleNavigate(AppRoutes.employees);
                }}
              />
            </ul>
          </ExpansionMenu>
          <ExpansionMenu
            title="Client Master"
            icon={"https://cdn-icons-png.flaticon.com/128/17873/17873047.png"}
            isOpen={openSubmenu === "client"}
            onClick={() => toggleSubmenu("client")}
          >
            <ul>
              <NaviLink
                label="Clients"
                isActive={location.pathname === AppRoutes.clients}
                onClick={() => {
                  handleNavigate(AppRoutes.clients);
                }}
              />
            </ul>
          </ExpansionMenu>
          <ExpansionMenu
            title="Project Master"
            icon={"https://cdn-icons-png.flaticon.com/128/12673/12673724.png"}
            isOpen={openSubmenu === "project"}
            onClick={() => toggleSubmenu("project")}
          >
            <ul>
              <NaviLink
                label="Projects"
                isActive={location.pathname === AppRoutes.projects}
                onClick={() => {
                  handleNavigate(AppRoutes.projects);
                }}
              />
              <NaviLink
                label="Project Module"
                isActive={location.pathname === AppRoutes.projectModule}
                onClick={() => {
                  handleNavigate(AppRoutes.projectModule);
                }}
              />
            </ul>
          </ExpansionMenu>
          <ExpansionMenu
            title="Project Assignment"
            icon={"https://cdn-icons-png.flaticon.com/128/4661/4661361.png"}
            isOpen={openSubmenu === "assignment"}
            onClick={() => toggleSubmenu("assignment")}
          >
            <ul>
              <NaviLink
                label="Assign Project"
                isActive={location.pathname === AppRoutes.assignProject}
                onClick={() => {
                  handleNavigate(AppRoutes.assignProject);
                }}
              />
            </ul>
          </ExpansionMenu>
          <ExpansionMenu
            title="Work Reports"
            icon={"https://cdn-icons-png.flaticon.com/128/18590/18590813.png"}
            isOpen={openSubmenu === "workReports"}
            onClick={() => toggleSubmenu("workReports")}
          >
            <ul>
              <NaviLink
                label="All Reports"
                isActive={location.pathname === AppRoutes.workreports}
                onClick={() => {
                  handleNavigate(AppRoutes.workreports);
                }}
              />
            </ul>
          </ExpansionMenu>
          <ExpansionMenu
            title="Timesheet Summary"
            icon={"https://cdn-icons-png.flaticon.com/128/3652/3652191.png"}
            isOpen={openSubmenu === "summary"}
            onClick={() => toggleSubmenu("summary")}
          >
            <ul>
              <NaviLink
                label="Summary"
                isActive={location.pathname === AppRoutes.summmary}
                onClick={() => {
                  handleNavigate(AppRoutes.summmary);
                }}
              />
            </ul>
          </ExpansionMenu>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
