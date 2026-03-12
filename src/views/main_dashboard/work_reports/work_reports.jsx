import { useState, useEffect } from "react";
import DataTable from "../../../components/custom_data_table";
import {
  CustomDropdownField,
  CustomTextField,
} from "../../../components/custom_text_and_dropdown_field";
import "../../../styles/employee.css";
import CustomButton from "../../../components/custom_button";
import { getAllEmployees } from "../../../services/employee_service";
import { toast } from "react-toastify";
import { getAllReports } from "../../../services/report_service";
import { getAllProjects } from "../../../services/project_service";
import CustomLoadingindicator from "../../../components/custom_loading";

function WorkReports() {
  const [isLoading, setIsLoading] = useState(false);

  const [workReports, setWorkReports] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  const today = new Date().toISOString().split("T")[0];
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(today);

  const columns = [
    { key: "sno", label: "S.No" },
    { key: "employeename", label: "Employee Name" },
    {
      key: "projectname",
      label: "Project Name",
      render: (value) => {
        return <div>{value ?? "-"}</div>;
      },
    },
    {
      key: "modulename",
      label: "Module Name",
      render: (value) => {
        return <div>{value ?? "-"}</div>;
      },
    },
    { key: "taskname", label: "Task" },
    { key: "workdate", label: "Date" },
    { key: "starttime", label: "Start Time" },
    { key: "endtime", label: "End Time" },
    {
      key: "workinghours",
      label: "Hours Worked",
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

  /* ================= API FUNCTIONS ================= */

  const getAllEmployeeData = async () => {
    try {
      const responseData = await getAllEmployees();
      if (responseData.status === "success") {
        const employeeData = (responseData.data || []).map((data, index) => ({
          ...data,
          sno: index + 1,
        }));
        setEmployees(employeeData);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load employees");
    }
  };

  const getAllProjectsData = async () => {
    try {
      const response = await getAllProjects();
      if (response.status === "success") {
        const data = (response.data || []).map((item, index) => ({
          ...item,
          sno: index + 1,
        }));
        setProjects(data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load projects");
    }
  };

  const getAllReportsData = async ({ employeeid, projectid, workdate }) => {
    try {
      const response = await getAllReports({
        employeeid,
        projectid,
        workdate,
      });
      if (response.status === "success") {
        const data = (response.data || []).map((item, index) => ({
          ...item,
          sno: index + 1,
        }));
        setWorkReports(data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load reports");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        getAllEmployeeData(),
        getAllProjectsData(),
        getAllReportsData({
          employeeid: null,
          projectid: null,
          workdate: today,
        }),
      ]);
      setIsLoading(false);
    };

    fetchData();
  }, [today]);

  if (isLoading) {
    return <CustomLoadingindicator />;
  }

  return (
    <div>
      <h3 style={{ color: "#06433e", fontWeight: "600", marginBottom: "20px" }}>
        Work Reports
      </h3>

      <div className="add-employee-container">
        <div className="add-employee-form">
          <CustomDropdownField
            label="Employee"
            value={employeeFilter}
            onChange={(e) => {
              setEmployeeFilter(e.target.value);
            }}
            options={employees.map((emp) => ({
              value: emp.employeeid,
              label: emp.employeename,
            }))}
          />

          <CustomDropdownField
            label="Project"
            value={projectFilter}
            onChange={(e) => {
              setProjectFilter(e.target.value);
            }}
            options={projects.map((project) => ({
              value: project.projectid,
              label: project.projectname,
            }))}
          />

          <CustomTextField
            label="Work Date"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="button-container">
          <CustomButton
            text="Submit"
            onClick={async () => {
              setIsLoading(true);
              await getAllReportsData({
                employeeid: employeeFilter || null,
                projectid: projectFilter || null,
                workdate: dateFilter || null,
              });
              setIsLoading(false);
            }}
          />
          <CustomButton
            text="Reset"
            isResetBtn={true}
            onClick={async () => {
              setEmployeeFilter("");
              setProjectFilter("");
              setDateFilter(today);
              setIsLoading(true);
              await getAllReportsData({
                employeeid: null,
                projectid: null,
                workdate: today,
              });
              setIsLoading(false);
            }}
          />
        </div>
      </div>

      <div style={{ height: "25px" }} />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={workReports}
        loading={isLoading}
        pageSize={10}
      />
    </div>
  );
}

export default WorkReports;
