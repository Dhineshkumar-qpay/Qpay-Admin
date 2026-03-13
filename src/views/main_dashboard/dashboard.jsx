import React, { useEffect, useState, useCallback } from "react";
import "../../styles/dashboard.css";
import { toast } from "react-toastify";
import {
  getTotalDashCounts,
  getAllReports,
} from "../../services/report_service";
import { getAllEmployees } from "../../services/employee_service";
import CustomLoadingindicator from "../../components/custom_loading.jsx";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../utils/app_routes";
import DataTable from "../../components/custom_data_table";
import ApiRoutes from "../../utils/api_routes.js";

function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [employeeHours, setEmployeeHours] = useState([]);
  const [stats, setStats] = useState({
    pendingLeaves: 0,
    approvedLeaves: 0,
    activeProjects: 0,
  });
  const [cards, setCards] = useState([
    {
      title: "Employees",
      value: 0,
      icon: "https://cdn-icons-png.flaticon.com/128/3770/3770199.png",
      route: AppRoutes.employees,
    },
    {
      title: "Projects",
      value: 0,
      icon: "https://cdn-icons-png.flaticon.com/128/12673/12673724.png",
      route: AppRoutes.projects,
    },
    {
      title: "Clients",
      value: 0,
      icon: "https://cdn-icons-png.flaticon.com/128/17873/17873047.png",
      route: AppRoutes.clients,
    },
    {
      title: "Work Reports",
      value: 0,
      icon: "https://cdn-icons-png.flaticon.com/128/18590/18590813.png",
      route: AppRoutes.workreports,
    },
    {
      title: "Pending Leaves",
      value: 0,
      icon: "https://cdn-icons-png.flaticon.com/128/10691/10691802.png",
      route: AppRoutes.leave,
    },
    {
      title: "Timesheet Summary",
      value: 0,
      icon: "https://cdn-icons-png.flaticon.com/128/3652/3652191.png",
      route: AppRoutes.summmary,
    },
  ]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const today = new Date().toISOString().split("T")[0];
    try {
      const [countsRes, reportsRes, employeesRes] = await Promise.all([
        getTotalDashCounts(),
        getAllReports({ workdate: today }),
        getAllEmployees(),
      ]);

      if (countsRes.status === "success") {
        const {
          employees,
          projects,
          clients,
          reports,
          pendingLeaves,
          summaries,
          approvedLeaves,
          activeProjects,
        } = countsRes.data;

        const totalCounts = [
          employees,
          projects,
          clients,
          reports,
          pendingLeaves,
          summaries,
        ];

        setCards((prev) =>
          prev.map((card, index) => ({
            ...card,
            value: totalCounts[index] || 0,
          })),
        );

        setStats({
          pendingLeaves,
          approvedLeaves,
          activeProjects,
        });
      }

      const todayReports =
        reportsRes.status === "success" ? reportsRes.data : [];
      if (reportsRes.status === "success") {
        const formatted = todayReports.map((item, index) => ({
          ...item,
          sno: index + 1,
        }));
        setRecentReports(formatted);
      }

      if (employeesRes.status === "success") {
        const activeEmployees = employeesRes.data.filter(
          (emp) => emp.status === "Active",
        );

        const hoursMap = {};
        todayReports.forEach((report) => {
          const empId = report.employeeid;
          const val = parseFloat(report.workinghours) || 0;
          const h = Math.floor(val);
          const m = Math.round((val - h) * 100);
          const totalMins = h * 60 + m;
          hoursMap[empId] = (hoursMap[empId] || 0) + totalMins;
        });

        const stats = activeEmployees.map((emp) => {
          const totalMinutes = hoursMap[emp.employeeid] || 0;
          return {
            id: emp.employeeid,
            name: emp.employeename,
            profile: emp.profile,
            hours: totalMinutes,
          };
        });

        setEmployeeHours(stats);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    { key: "sno", label: "S.No" },
    { key: "employeename", label: "Employee" },
    { key: "projectname", label: "Project" },
    { key: "taskname", label: "Task" },
    { key: "workdate", label: "Date" },
    {
      key: "workinghours",
      label: "Hours",
      render: (val) => {
        const value = parseFloat(val) || 0;
        const hPart = Math.floor(value);
        const mPart = Math.round((value - hPart) * 100);
        const totalMinutes = hPart * 60 + mPart;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes < 10 ? "0" + minutes : minutes}m`;
      },
    },
  ];

  if (isLoading) {
    return <CustomLoadingindicator />;
  }

  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-title">Welcome Admin!!</h2>

      <div className="dashboard-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`dashboard-card card-${index}`}
            onClick={() => navigate(card.route)}
          >
            <div className="card-left">
              <img src={card.icon} alt={card.title} />
            </div>

            <div className="card-right">
              <p>{card.title}</p>
              <h3>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="stats-insight-section" style={{ marginTop: "50px" }}>
        <div
          className="stats-insight-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Project Status Card */}
          <div
            className="stat-insight-card"
            style={{
              background: "linear-gradient(to bottom right, #ffffff, #f8fafc)",
              padding: "24px",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              border: "1px solid #e2e8f0",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "4px",
                height: "100%",
                background: "#10b981",
              }}
            ></div>
            <h4
              style={{
                margin: "0 0 20px 0",
                color: "#000000",
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Project Real-time Status
            </h4>
            <div className="stat-insight-content">
              <div
                className="stat-item"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#64748b", fontWeight: "500" }}>
                  Active Projects
                </span>
                <strong style={{ color: "#1e293b", fontSize: "20px" }}>
                  {stats.activeProjects}
                </strong>
              </div>
              <div
                className="stat-item"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "18px",
                }}
              >
                <span style={{ color: "#64748b", fontWeight: "500" }}>
                  Total Projects
                </span>
                <strong style={{ color: "#64748b", fontSize: "16px" }}>
                  {cards[1]?.value}
                </strong>
              </div>
            </div>
          </div>

          {/* Leave Management Card */}
          <div
            className="stat-insight-card"
            style={{
              background: "linear-gradient(to bottom right, #ffffff, #fffcf9)",
              padding: "24px",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              border: "1px solid #e2e8f0",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "4px",
                height: "100%",
                background: "#f59e0b",
              }}
            ></div>
            <h4
              style={{
                margin: "0 0 20px 0",
                color: "#000000",
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Leave Management Summary
            </h4>
            <div className="stat-insight-content">
              <div
                className="stat-item"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#64748b", fontWeight: "500" }}>
                  Pending Requests
                </span>
                <strong style={{ color: "#f59e0b", fontSize: "24px" }}>
                  {stats.pendingLeaves}
                </strong>
              </div>
              <div
                className="stat-item"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "18px",
                }}
              >
                <span style={{ color: "#64748b", fontWeight: "500" }}>
                  Approved Today
                </span>
                <strong style={{ color: "#10b981", fontSize: "18px" }}>
                  {stats.approvedLeaves}
                </strong>
              </div>
              <div
                className="leave-status-tag"
                style={{
                  marginTop: "10px",
                  padding: "12px",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: "700",
                  textAlign: "center",
                  backgroundColor:
                    stats.pendingLeaves > 0 ? "#fffbeb" : "#f0fdf4",
                  color: stats.pendingLeaves > 0 ? "#b45309" : "#15803d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  border: `1px solid ${stats.pendingLeaves > 0 ? "#fef3c7" : "#dcfce7"}`,
                  boxShadow:
                    stats.pendingLeaves > 0
                      ? "0 2px 10px rgba(245, 158, 11, 0.05)"
                      : "none",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor:
                      stats.pendingLeaves > 0 ? "#f59e0b" : "#10b981",
                    boxShadow: `0 0 8px ${stats.pendingLeaves > 0 ? "rgba(245, 158, 11, 0.4)" : "rgba(16, 185, 129, 0.4)"}`,
                  }}
                ></span>
                {stats.pendingLeaves > 0
                  ? `${stats.pendingLeaves} Review(s) Required`
                  : "No Outstanding Actions"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="employee-working-section" style={{ marginTop: "40px" }}>
        <h3
          style={{
            color: "#1e293b",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          Today's Employee Working Hours
        </h3>
        <div className="employee-hours-grid">
          {employeeHours.map((emp) => {
            const h = Math.floor(emp.hours / 60);
            const m = emp.hours % 60;
            return (
              <div key={emp.id} className="emp-hour-card">
                <div className="emp-info">
                  <img
                    src={
                      emp.profile
                        ? `${ApiRoutes.baseUrl}${emp.profile}`
                        : "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
                    }
                    style={{ objectFit: "contain" }}
                    alt={emp.name}
                    className="emp-hour-profile"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://cdn-icons-png.flaticon.com/128/3135/3135715.png";
                    }}
                  />
                  <div>
                    <p className="emp-hour-name">{emp.name}</p>
                    <p className="emp-hour-tag">Today</p>
                  </div>
                </div>
                <div className="emp-hour-value">
                  {h}h {m < 10 ? "0" + m : m}m
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="recent-activity-section" style={{ marginTop: "40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ color: "#1e293b", margin: 0, fontWeight: "600" }}>
            Today's Work Reports
          </h3>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#3b82f6",
              fontWeight: "600",
              cursor: "pointer",
            }}
            onClick={() => navigate(AppRoutes.workreports)}
          >
            Manage Reports
          </button>
        </div>
        <div>
          {recentReports.length > 0 ? (
            <DataTable
              columns={columns}
              data={recentReports}
              loading={false}
              pageSize={5}
            />
          ) : (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#64748b" }}
            >
              <p>No work reports submitted for today yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
