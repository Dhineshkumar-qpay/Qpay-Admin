import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./views/login/login.jsx";
import MainDashboard from "./views/main_dashboard/maindashboard.jsx";
import AppRoutes from "./utils/app_routes.js";
import Employees from "./views/main_dashboard/employee_management/employees.jsx";
import Projects from "./views/main_dashboard/project_management/projects.jsx";
import AssignProjects from "./views/main_dashboard/assign_project/assign_projects.jsx";
import WorkReports from "./views/main_dashboard/work_reports/work_reports.jsx";
import Dashboard from "./views/main_dashboard/dashboard.jsx";
import TimeSheetSummary from "./views/main_dashboard/time_sheet_summary/time_sheet_summary.jsx";
import ProjectModules from "./views/main_dashboard/project_management/project_module.jsx";
import Clients from "./views/main_dashboard/client_management/clients.jsx";
import { ToastContainer } from "react-toastify";
import Leaves from "./views/main_dashboard/leave/leave.jsx";

const ProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");

  if (adminToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  useEffect(() => {
    const handleStorageChange = (e) => {
      // If adminToken is removed (logout) in another tab
      if (e.key === "adminToken" && !e.newValue) {
        window.location.href = "/login";
      }
      // Handle localStorage.clear()
      if (e.key === null && localStorage.getItem("adminToken") === null) {
        window.location.href = "/login";
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path={AppRoutes.employees} element={<Employees />} />
          <Route path={AppRoutes.projects} element={<Projects />} />
          <Route path={AppRoutes.projectModule} element={<ProjectModules />} />
          <Route path={AppRoutes.assignProject} element={<AssignProjects />} />
          <Route path={AppRoutes.workreports} element={<WorkReports />} />
          <Route path={AppRoutes.summmary} element={<TimeSheetSummary />} />
          <Route path={AppRoutes.clients} element={<Clients />} />
          <Route path={AppRoutes.leave} element={<Leaves />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
