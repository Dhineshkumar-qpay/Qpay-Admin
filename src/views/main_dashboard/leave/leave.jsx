import React, { useCallback, useEffect, useState } from "react";
import { CustomDropdownField } from "../../../components/custom_text_and_dropdown_field.jsx";
import "../../../styles/leave.css";
import DataTable from "../../../components/custom_data_table.jsx";
import { getAllEmployees } from "../../../services/employee_service.js";
import {
  getAllLeaves,
  updateLeaveStatus,
} from "../../../services/leave_service.js";
import { toast } from "react-toastify";
import CustomLoadingindicator from "../../../components/custom_loading.jsx";
import CustomButton from "../../../components/custom_button.jsx";

function Leaves() {
  const [isLoading, setIsLoading] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [displayLeaves, setDisplayLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const currentYear = new Date().getFullYear().toString();

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const columns = [
    { key: "sno", label: "S.No" },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="action-buttons">
          {row.status === "Pending" && (
            <>
              <button
                className="approve-btn"
                onClick={() => handleUpdateStatus(row.leaveid, "Approved")}
              >
                Approve
              </button>
              <button
                className="reject-btn"
                onClick={() => handleUpdateStatus(row.leaveid, "Rejected")}
              >
                Reject
              </button>
            </>
          )}
          {row.status !== "Pending" && (
            <span
              style={{ fontSize: "12px", color: "#888", fontStyle: "italic" }}
            >
              No Actions
            </span>
          )}
        </div>
      ),
    },
    { key: "employeename", label: "Employee Name" },
    { key: "leavetype", label: "Leave Type" },
    { key: "startdate", label: "Start Date" },
    { key: "enddate", label: "End Date" },
    { key: "totaldays", label: "Total Days" },
    { key: "reason", label: "Reason" },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        const statusClass =
          value === "Approved"
            ? "status-approved"
            : value === "Rejected"
              ? "status-rejected"
              : "status-pending";
        return <span className={`status-badge ${statusClass}`}>{value}</span>;
      },
    },
  ];

  const handleUpdateStatus = async (leaveid, status) => {
    try {
      const response = await updateLeaveStatus({ leaveid, status });
      if (response.status === "success") {
        toast.success(response.message);
        fetchAllData();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [leavesRes, employeesRes] = await Promise.all([
        getAllLeaves(),
        getAllEmployees(),
      ]);

      if (leavesRes.status === "success") {
        setLeaves(leavesRes.data);
        // Initially filter by current year
        const initialFiltered = leavesRes.data
          .filter((leave) => {
            const leaveYear = leave.startdate
              ? leave.startdate.split("-")[0]
              : "";
            return leaveYear === currentYear;
          })
          .map((item, index) => ({ ...item, sno: index + 1 }));

        setDisplayLeaves(initialFiltered);
      }
      if (employeesRes.status === "success") {
        setEmployees(employeesRes.data);
      }
    } catch (error) {
      console.error("Fetch Data Error:", error);
      toast.error(error.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [currentYear]);

  const handleFetch = () => {
    const filtered = leaves
      .filter((leave) => {
        const matchesEmployee = filterEmployee
          ? leave.employeeid.toString() === filterEmployee
          : true;
        const matchesMonth = filterMonth
          ? leave.startdate && leave.startdate.split("-")[1] === filterMonth
          : true;

        const leaveYear = leave.startdate ? leave.startdate.split("-")[0] : "";
        const matchesYear = leaveYear === currentYear;

        return matchesEmployee && matchesMonth && matchesYear;
      })
      .map((item, index) => ({ ...item, sno: index + 1 }));

    setDisplayLeaves(filtered);
  };

  const handleReset = () => {
    setFilterEmployee("");
    setFilterMonth("");
    // Show current year full data
    const initialFiltered = leaves
      .filter((leave) => {
        const leaveYear = leave.startdate ? leave.startdate.split("-")[0] : "";
        return leaveYear === currentYear;
      })
      .map((item, index) => ({ ...item, sno: index + 1 }));

    setDisplayLeaves(initialFiltered);
  };

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (isLoading) return <CustomLoadingindicator />;

  return (
    <div>
      <h3 style={{ color: "#06433e", marginBottom: "20px", fontWeight: "600" }}>
        Leave Management
      </h3>

      <div className="leave-filter-container">
        <CustomDropdownField
          label="Select Employee"
          options={employees.map((emp) => ({
            value: emp.employeeid.toString(),
            label: emp.employeename,
          }))}
          value={filterEmployee}
          onChange={(e) => setFilterEmployee(e.target.value)}
        />
        <CustomDropdownField
          label="Select Month"
          options={months}
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        />
        <div
          className="button-container"
          style={{ gridColumn: "span 2", marginTop: "10px" }}
        >
          <CustomButton text="Submit" onClick={handleFetch} />
          <CustomButton text="Reset" isResetBtn={true} onClick={handleReset} />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={displayLeaves}
        loading={false}
        pageSize={10}
      />
    </div>
  );
}

export default Leaves;
