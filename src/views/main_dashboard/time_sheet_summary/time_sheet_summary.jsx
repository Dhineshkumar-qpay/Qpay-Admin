import React, { useState, useEffect, useCallback } from "react";
import DataTable from "../../../components/custom_data_table";
import { CustomDropdownField } from "../../../components/custom_text_and_dropdown_field";
import "../../../styles/employee.css";
import CustomButton from "../../../components/custom_button";
import { getAllEmployees } from "../../../services/employee_service";
import { getAllProjects } from "../../../services/project_service";
import { getTimeSheetSummary } from "../../../services/report_service";
import { toast } from "react-toastify";
import { exportToExcel } from "../../../utils/excel_export";
import CustomLoadingindicator from "../../../components/custom_loading";

function TimeSheetSummary() {
  const currentDate = new Date();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  const [employeeFilter, setEmployeeFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState(monthName);
  const [yearFilter, setYearFilter] = useState("");

  const fetchFiltersData = async () => {
    try {
      const [empRes, projRes] = await Promise.all([
        getAllEmployees(),
        getAllProjects(),
      ]);
      setEmployees(empRes.data || []);
      setProjects(projRes.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load filter data");
    }
  };

  const fetchSummaries = useCallback(
    async (filters = null) => {
      setLoading(true);
      try {
        const data = filters || {
          employeeid: employeeFilter || null,
          projectid: projectFilter || null,
          month: monthFilter || monthName,
          year: yearFilter || null,
        };

        const response = await getTimeSheetSummary(data);

        if (response.status === "success") {
          const resultWithSno = (response.data || []).map((item, index) => ({
            ...item,
            sno: index + 1,
          }));
          setTimesheets(resultWithSno);
        } else {
          toast.error(response.message || "Failed to fetch timesheet summary");
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch timesheet summary");
      } finally {
        setLoading(false);
      }
    },
    [employeeFilter, projectFilter, monthFilter, yearFilter, monthName],
  );

  useEffect(() => {
    const initialize = async () => {
      setIsDataLoading(true);
      await fetchFiltersData();
      await fetchSummaries({});
      setIsDataLoading(false);
    };

    initialize();
  }, [fetchSummaries]);
  
  const handleReset = () => {
    setEmployeeFilter("");
    setProjectFilter("");
    setMonthFilter(monthName);
    setYearFilter("");
    fetchSummaries({});
  };

  const handleExport = () => {
    if (timesheets.length === 0) {
      toast.warn("No data to export");
      return;
    }
    const exportData = timesheets.map((item) => {
      const value = parseFloat(item.totalHours) || 0;
      const hPart = Math.floor(value);
      const mPart = Math.round((value - hPart) * 100);
      const totalMinutes = hPart * 60 + mPart;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return {
        "S.No": item.sno,
        "Employee Name": item.employeeName,
        "Project Name": item.projectName,
        Month: item.month,
        Year: item.year,
        "Total Working Days": `${item.totalDays} ${item.totalDays > 1 ? "days" : "day"}`,
        "Total Hours": `${hours}h ${minutes < 10 ? "0" + minutes : minutes}m`,
      };
    });
    exportToExcel(exportData, "Timesheet_Summary");
  };

  const columns = [
    { key: "sno", label: "S.No" },
    {
      key: "employeeName",
      label: "Employee Name",
      render: (val) => {
        return <>{val ?? "-"}</>;
      },
    },
    {
      key: "projectName",
      label: "Project Name",
      render: (val) => {
        return <>{val ?? "-"}</>;
      },
    },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
    {
      key: "totalDays",
      label: "Total Working Days",
      render: (val) => `${val} ${val > 1 ? "days" : "day"}`,
    },
    {
      key: "totalHours",
      label: "Total Hours",
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

  if (isDataLoading) {
    return <CustomLoadingindicator />;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ color: "#06433e", fontWeight: "600", margin: 0 }}>
          Timesheet Summary Reports
        </h3>
        <CustomButton text="Download" onClick={handleExport} />
      </div>

      <div className="add-employee-container">
        <div className="add-employee-form">
          <CustomDropdownField
            label="Select Employee"
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            options={employees.map((emp) => ({
              value: emp.employeeid,
              label: emp.employeename,
            }))}
          />

          <CustomDropdownField
            label="Select Project"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            options={projects.map((proj) => ({
              value: proj.projectid,
              label: proj.projectname,
            }))}
          />
          <CustomDropdownField
            label="Select Month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            options={[
              { value: "January", label: "January" },
              { value: "February", label: "February" },
              { value: "March", label: "March" },
              { value: "April", label: "April" },
              { value: "May", label: "May" },
              { value: "June", label: "June" },
              { value: "July", label: "July" },
              { value: "August", label: "August" },
              { value: "September", label: "September" },
              { value: "October", label: "October" },
              { value: "November", label: "November" },
              { value: "December", label: "December" },
            ]}
          />

          <CustomDropdownField
            label="Select Year"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            options={[
              { value: "2024", label: "2024" },
              { value: "2025", label: "2025" },
              { value: "2026", label: "2026" },
              { value: "2027", label: "2027" },
            ]}
          />
        </div>
        <div className="button-container">
          <CustomButton text="Submit" onClick={() => fetchSummaries()} />
          <CustomButton text="Reset" isResetBtn={true} onClick={handleReset} />
        </div>
      </div>

      <div style={{ height: "25px" }} />

      {/* ---------------- DataTable ---------------- */}
      <DataTable
        columns={columns}
        data={timesheets}
        loading={loading}
        pageSize={10}
      />
    </div>
  );
}

export default TimeSheetSummary;
