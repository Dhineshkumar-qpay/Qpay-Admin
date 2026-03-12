import { useEffect, useState, useCallback } from "react";
import {
  CustomTextField,
  ToggleSwitch,
  CustomSearchField,
  CustomDropdownField,
} from "../../../components/custom_text_and_dropdown_field.jsx";
import "../../../styles/employee.css";
import CustomButton from "../../../components/custom_button.jsx";
import DataTable from "../../../components/custom_data_table.jsx";
import {
  addProject,
  deleteProject,
  getAllProjects,
  updateProject,
  updateProjectStatus,
} from "../../../services/project_service.js";
import { toast } from "react-toastify";
import { ConfirmationDialog } from "../../../components/logout.jsx";
import { getAllClients } from "../../../services/client_service.js";

function Projects() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [fieldError, setFieldError] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clientFilter, setClientFilter] = useState(0);

  const [formData, setFormData] = useState({
    projectid: 0,
    clientid: 0,
    projectname: "",
    description: "",
    startdate: "",
    enddate: "",
    status: "Active",
  });

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFieldError((prev) => ({
      ...prev,
      [field]: "",
    }));
  }, []);

  const handleReset = useCallback(() => {
    setFormData({
      projectid: 0,
      clientid: 0,
      projectname: "",
      description: "",
      startdate: "",
      enddate: "",
      status: "Active",
    });
    setFieldError({});
    setSelectedProject(null);
    setIsUpdate(false);
    setClientFilter(0);
  }, []);

  const handleEdit = useCallback((row) => {
    setIsUpdate(true);
    setSelectedProject(row);
    setFormData({
      projectid: row.projectid ?? 0,
      projectname: row.projectname ?? "",
      clientid: row.clientid ?? 0,
      description: row.description ?? "",
      startdate: row.startdate ?? "",
      enddate: row.enddate ?? "",
      status: row.status ?? "Active",
    });
    setClientFilter(row.clientid ?? 0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.projectname?.trim()) {
      errors.projectname = "Please enter project name";
    }
    if (clientFilter === 0) {
      errors.clientname = "Please select client";
    }
    if (!formData.description?.trim()) {
      errors.description = "Please enter description";
    }
    if (!formData.startdate) {
      errors.startdate = "Please select start date";
    }
    if (!formData.enddate) {
      errors.enddate = "Please select end date";
    } else if (
      formData.enddate &&
      formData.startdate &&
      new Date(formData.enddate) < new Date(formData.startdate)
    ) {
      errors.enddate = "End date cannot be before start date";
    }
    setFieldError(errors);
    return Object.keys(errors).length === 0;
  }, [formData, clientFilter]);

  const getAllProjectsData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllProjects(null);
      if (response.status === "success") {
        const data = response.data.map((item, index) => ({
          ...item,
          sno: index + 1,
        }));
        setProjects(data);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAllClientData = useCallback(async () => {
    try {
      const responseData = await getAllClients();
      if (responseData.status === "success") {
        const clientData = responseData.data
          .filter((data) => data.status === "Active")
          .map((data, index) => ({
            ...data,
            sno: index + 1,
          }));
        setClients(clientData);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load clients");
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        clientid: parseInt(clientFilter),
      };
      let response;
      if (formData.projectid === 0 || !formData.projectid) {
        response = await addProject(submitData);
      } else {
        response = await updateProject(submitData);
      }
      if (response.status === "success") {
        toast.success(response.message);
        handleReset();
        await getAllProjectsData();
      } else {
        toast.error(response.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error.message || "Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, clientFilter, validateForm, handleReset, getAllProjectsData]);

  const deleteProjectData = useCallback(async () => {
    if (!selectedProject) return;
    try {
      const response = await deleteProject({
        projectid: selectedProject.projectid,
      });
      if (response.status === "success") {
        toast.success("Project deleted successfully!");
        await getAllProjectsData();
      } else {
        toast.error(response.message || "Failed to delete project");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete project");
    } finally {
      setIsOpen(false);
      setSelectedProject(null);
    }
  }, [selectedProject, getAllProjectsData]);

  const updateStatus = useCallback(async ({ projectid, status }) => {
    try {
      const response = await updateProjectStatus({
        projectid,
        status,
      });
      if (response.status === "success") {
        setProjects((prev) =>
          prev.map((item) =>
            item.projectid === projectid ? { ...item, status } : item,
          ),
        );
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }, []);

  useEffect(() => {
    getAllProjectsData();
    getAllClientData();
  }, [getAllProjectsData, getAllClientData]);

  const filteredProjects = projects.filter((p) => {
    const searchText = search.toLowerCase();
    return (
      p.projectname?.toLowerCase().includes(searchText) ||
      p.clientname?.toLowerCase().includes(searchText) ||
      p.description?.toLowerCase().includes(searchText)
    );
  });

  const columns = [
    { key: "sno", label: "S.No" },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
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
              setSelectedProject(row);
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
            onClick={() => handleEdit(row)}
          />
        </div>
      ),
    },
    { key: "projectname", label: "Project Name" },
    { key: "contactperson", label: "Client Name" },
    { key: "description", label: "Description" },
    {
      key: "startdate",
      label: "Start Date",
      render: (value) => <div>{formatDate(value)}</div>,
    },
    {
      key: "enddate",
      label: "End Date",
      render: (value) => <div>{formatDate(value)}</div>,
    },
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
            backgroundColor: value === "Active" ? "#e6f7f1" : "#fdeaea",
            color: value === "Active" ? "#0f9d58" : "#d93025",
          }}
        >
          {value}
        </span>
      ),
    },
    {
      key: "statusToggle",
      label: "Toggle Status",
      render: (_, row) => (
        <ToggleSwitch
          label=""
          checked={row.status === "Active"}
          onChange={async () => {
            const newStatus = row.status === "Active" ? "Inactive" : "Active";
            await updateStatus({
              projectid: row.projectid,
              status: newStatus,
            });
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <h3 style={{ color: "#06433e", marginBottom: "15px" }}>
        {isUpdate ? "Update Project" : "Create Project"}
      </h3>

      <div className="add-employee-container">
        <div className="add-employee-form">
          <CustomTextField
            label="Project Name"
            value={formData.projectname}
            error={fieldError.projectname}
            onChange={(e) => handleChange("projectname", e.target.value)}
            placeholder="Enter project name"
          />
          <CustomDropdownField
            label="Client"
            value={clientFilter}
            onChange={(e) => {
              setClientFilter(e.target.value);
              handleChange("clientid", e.target.value);
            }}
            error={fieldError.clientname}
            options={clients.map((client) => ({
              value: client.clientid,
              label: client.contactperson,
            }))}
          />
          <CustomTextField
            label="Description"
            value={formData.description}
            error={fieldError.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter project description"
          />
          <CustomTextField
            label="Start Date"
            type="date"
            value={formData.startdate}
            error={fieldError.startdate}
            onChange={(e) => handleChange("startdate", e.target.value)}
          />
          <CustomTextField
            label="End Date"
            type="date"
            value={formData.enddate}
            error={fieldError.enddate}
            onChange={(e) => handleChange("enddate", e.target.value)}
          />
        </div>

        <div className="button-container">
          <CustomButton
            text={isSubmitting ? "Loading..." : isUpdate ? "Update" : "Submit"}
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
          <CustomButton text="Reset" isResetBtn={true} onClick={handleReset} />
        </div>
      </div>

      <div>
        <h3 style={{ color: "#06433e", fontWeight: "600", marginTop: "30px" }}>
          Project List
        </h3>
        <CustomSearchField
          title="Search Project"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <DataTable
          columns={columns}
          data={filteredProjects}
          loading={isLoading}
          pageSize={10}
        />
      </div>

      <ConfirmationDialog
        title={selectedProject?.projectname || ""}
        isOpen={isOpen}
        onConfirm={deleteProjectData}
        onCancel={() => {
          setIsOpen(false);
          setSelectedProject(null);
        }}
      />
    </div>
  );
}

export default Projects;
