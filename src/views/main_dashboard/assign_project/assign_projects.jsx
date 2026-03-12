import { useState, useEffect } from "react";
import {
  CustomDropdownField,
  CustomTextField,
  CustomSearchField,
} from "../../../components/custom_text_and_dropdown_field";
import CustomButton from "../../../components/custom_button";
import DataTable from "../../../components/custom_data_table";
import "../../../styles/employee.css";
import { getAllEmployees } from "../../../services/employee_service";
import {
  addAssignments,
  deleteAssignment,
  getAllAssignments,
  getAllProjects,
  getProjectByModules,
  updateAssignments,
} from "../../../services/project_service";
import { toast } from "react-toastify";
import CustomLoadingindicator from "../../../components/custom_loading";
import { ConfirmationDialog } from "../../../components/logout";

function AssignProjects() {
  const [search, setSearch] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [fieldError, setFieldError] = useState({});
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [formData, setFormData] = useState({
    assignmentid: 0,
    projectid: 0,
    employeeid: 0,
    moduleid: 0,
    priority: "",
    assigneddate: "",
    deadlinedate: "",
    remarks: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFieldError((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleReset = () => {
    setFormData({
      assignmentid: 0,
      projectid: 0,
      employeeid: 0,
      priority: "",
      moduleid: 0,
      assigneddate: "",
      deadlinedate: "",
      remarks: "",
    });
    setModules([]);
    setFieldError({});
    setIsUpdate(false);
    setSelectedAssignment(null);
  };

  /* -------------------- API FUNCTIONS -------------------- */

  const handleSubmit = async () => {
    let errors = {};

    if (!formData.employeeid) errors.employeeid = "Employee is required";
    if (!formData.projectid) errors.projectid = "Project is required";
    if (!formData.moduleid) errors.moduleid = "Module is required";
    if (!formData.assigneddate)
      errors.assigneddate = "Assigned date is required";

    if (!formData.deadlinedate) errors.deadlinedate = "Deadline is required";
    if (!formData.priority) errors.priority = "Please select priority";
    if (
      formData.assigneddate &&
      formData.deadlinedate &&
      new Date(formData.deadlinedate) < new Date(formData.assigneddate)
    ) {
      errors.deadlinedate = "Deadline cannot be before assigned date";
    }

    setFieldError(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      let responseData;
      if (formData.assignmentid === 0 || !formData.assignmentid) {
        responseData = await addAssignments(formData);
      } else {
        responseData = await updateAssignments(formData);
      }

      if (responseData.status === "success") {
        toast.success(
          formData.assignmentid === 0
            ? "Assignment created successfully!"
            : "Assignment updated successfully!",
        );
        handleReset();
        await getAllAssignmentsData();
      } else {
        toast.error(responseData.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error.message || "Failed to save assignment");
    }
  };

  const getAllEmployeeData = async () => {
    try {
      const response = await getAllEmployees();
      if (response.status === "success") {
        setEmployees(response.data);
      }
    } catch (error) {
      toast.error("Failed to load employees");
    }
  };

  const getAllProjectsData = async () => {
    try {
      const response = await getAllProjects();
      if (response.status === "success") {
        setProjects(response.data);
      }
    } catch (error) {
      toast.error("Failed to load projects");
    }
  };

  const getModulesByProject = async (projectid) => {
    if (!projectid) {
      setModules([]);
      return;
    }
    try {
      const response = await getProjectByModules({ projectid });
      if (response.status === "success") {
        setModules(response.data);
      } else {
        setModules([]);
      }
    } catch (error) {
      setModules([]);
      toast.error(error.message);
    }
  };

  const getAllAssignmentsData = async () => {
    try {
      const response = await getAllAssignments();
      if (response.status === "success") {
        const data = response.data.map((assignment, index) => ({
          ...assignment,
          sno: index + 1,
        }));
        setAssignments(data);
      } else {
        toast.error(response.message || "Failed to load assignments");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteAssignmentData = async () => {
    if (!selectedAssignment) return;
    try {
      const responseData = await deleteAssignment({
        assignmentid: selectedAssignment.assignmentid,
      });
      if (responseData.status === "success") {
        toast.success("Assignment deleted successfully!");
        await getAllAssignmentsData();
      } else {
        toast.error(responseData.message || "Failed to delete assignment");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsOpen(false);
      setSelectedAssignment(null);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setIsPageLoading(true);
      try {
        await Promise.all([
          getAllEmployeeData(),
          getAllProjectsData(),
          getAllAssignmentsData(),
        ]);
      } finally {
        setIsPageLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const columns = [
    { key: "sno", label: "S.No" },
    {
      key: "actions",
      label: "Actions",
      render: (_, value) => (
        <div
          className="action-container"
          style={{ display: "flex", gap: "5px" }}
        >
          <img
            className="action-btn"
            src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png"
            alt="delete"
            height={17}
            width={15}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedAssignment(value);
              setIsOpen(true);
            }}
          />
          <img
            className="action-btn"
            src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png"
            alt="edit"
            height={17}
            width={15}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedAssignment(value);
              setIsUpdate(true);
              setFormData({
                ...value,
                projectid: Number(value.projectid),
                employeeid: Number(value.employeeid),
                moduleid: Number(value.moduleid),
                priority: capitalizeFirstLetter(value.priority ?? "Low"),
              });
              getModulesByProject(Number(value.projectid));
            }}
          />
        </div>
      ),
    },
    {
      key: "employeename",
      label: "Employee Name",
      render: (value) => {
        return <div>{value ?? "-"}</div>;
      },
    },
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
    {
      key: "assigneddate",
      label: "Assigned Date",
      render: (value) => {
        if (!value) return "-";
        const [year, month, day] = value.split("-");
        return <div>{`${day}-${month}-${year}`}</div>;
      },
    },
    {
      key: "deadlinedate",
      label: "Deadline Date",
      render: (value) => {
        if (!value) return "-";
        const [year, month, day] = value.split("-");
        return <div>{`${day}-${month}-${year}`}</div>;
      },
    },
    { key: "remarks", label: "Remarks" },
    { key: "priority", label: "Priority" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          style={{
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600",
            backgroundColor: value === "completed" ? "#e6f7f1" : "#fff0df",
            color: value === "completed" ? "#0f9d58" : "#ff8800",
          }}
        >
          {capitalizeFirstLetter(value)}
        </span>
      ),
    },
  ];

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const priorityOptions = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  if (isPageLoading) {
    return <CustomLoadingindicator />;
  }

  return (
    <div>
      <h4 style={{ color: "#06433e", marginBottom: "15px" }}>
        {isUpdate ? "Update Assignment" : "Add Assignment"}
      </h4>

      <div className="add-employee-container">
        <div className="add-employee-form">
          <CustomDropdownField
            label="Employee"
            value={formData.employeeid}
            error={fieldError.employeeid}
            onChange={(e) => handleChange("employeeid", e.target.value)}
            options={employees.map((emp) => ({
              value: emp.employeeid,
              label: emp.employeename,
            }))}
          />

          <CustomDropdownField
            label="Project"
            value={formData.projectid}
            error={fieldError.projectid}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              handleChange("projectid", selectedId);
              handleChange("moduleid", 0);
              getModulesByProject(selectedId);
            }}
            options={projects.map((project) => ({
              value: project.projectid,
              label: project.projectname,
            }))}
          />

          <CustomDropdownField
            label="Module"
            value={formData.moduleid}
            error={fieldError.moduleid}
            onChange={(e) => handleChange("moduleid", e.target.value)}
            options={modules.map((module) => ({
              value: module.moduleid,
              label: module.modulename,
            }))}
          />
          <CustomDropdownField
            label="Priority"
            value={formData.priority}
            error={fieldError.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            options={priorityOptions}
          />
          <CustomTextField
            label="Assigned Date"
            type="date"
            value={formData.assigneddate}
            error={fieldError.assigneddate}
            onChange={(e) => handleChange("assigneddate", e.target.value)}
          />

          <CustomTextField
            label="Deadline Date"
            type="date"
            value={formData.deadlinedate}
            error={fieldError.deadlinedate}
            onChange={(e) => handleChange("deadlinedate", e.target.value)}
          />

          <CustomTextField
            label="Remarks"
            value={formData.remarks}
            error={fieldError.remarks}
            onChange={(e) => handleChange("remarks", e.target.value)}
            placeholder="Enter remarks"
          />
        </div>

        <div className="button-container">
          <CustomButton
            text={isUpdate ? "Update" : "Submit"}
            onClick={handleSubmit}
          />
          <CustomButton text="Reset" isResetBtn onClick={handleReset} />
        </div>
      </div>

      <h4 style={{ color: "#06433e", fontWeight: "600", marginTop: "30px" }}>
        Assigned Project List
      </h4>

      <CustomSearchField
        title="Search Project / Employee"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <DataTable
        columns={columns}
        data={assignments.filter((emp) => {
          const searchText = (search || "").toLowerCase();
          return (
            emp.employeename?.toLowerCase().includes(searchText) ||
            emp.projectname?.toLowerCase().includes(searchText) ||
            emp.modulename?.toLowerCase().includes(searchText)
          );
        })}
        loading={false}
        pageSize={10}
      />

      <ConfirmationDialog
        title="assignment"
        isOpen={isOpen}
        onConfirm={deleteAssignmentData}
        onCancel={() => {
          setIsOpen(false);
          setSelectedAssignment(null);
        }}
      />
    </div>
  );
}

export default AssignProjects;
