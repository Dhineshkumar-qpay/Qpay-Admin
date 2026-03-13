import React, { useState, useEffect } from "react";
import {
  CustomTextField,
  CustomDropdownField,
  CustomSearchField,
} from "../../../components/custom_text_and_dropdown_field.jsx";
import CustomButton from "../../../components/custom_button.jsx";
import DataTable from "../../../components/custom_data_table.jsx";
import {
  addProjectModule,
  updateProjectModule,
  deleteProjectModule,
  getAllProjectModules,
  getAllProjects,
} from "../../../services/project_service.js";
import { toast } from "react-toastify";
import CustomLoadingindicator from "../../../components/custom_loading.jsx";
import { ConfirmationDialog } from "../../../components/logout.jsx";

function ProjectModules() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedProjectModule, setSelectedProjectModule] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [fieldError, setFieldError] = useState({});

  const [formData, setFormData] = useState({
    projectid: "",
    projectname: "",
    moduleid: 0,
    modulename: "",
    description: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = (row) => {
    setIsUpdate(true);

    setFormData({
      projectid: Number(row.projectid),
      projectname: row.projectname,
      moduleid: row.moduleid,
      modulename: row.modulename,
      description: row.description,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setFormData({
      projectid: "",
      projectname: "",
      moduleid: 0,
      modulename: "",
      description: "",
    });
    setIsUpdate(false);
    setFieldError({});
  };

  /* ------------------ Submit ------------------ */

  const handleSubmit = async () => {
    const errors = {};

    if (!formData.projectname) errors.projectname = "Please select project";

    if (!formData.modulename.trim())
      errors.modulename = "Please enter module name";

    setFieldError(errors);

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    try {
      let response;
      if (formData.moduleid === 0) {
        response = await addProjectModule({
          projectid: formData.projectid,
          modulename: formData.modulename,
          description: formData.description,
        });
      } else {
        response = await updateProjectModule({
          projectid: formData.projectid,
          moduleid: formData.moduleid,
          modulename: formData.modulename,
          description: formData.description,
        });
      }

      if (response.status === "success") {
        toast.success(response.message);
        handleReset();
        getAllProjectsModuleData();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------ API ------------------ */

  const getAllProjectsData = async () => {
    try {
      const response = await getAllProjects();
      if (response.status === "success") {
        setProjects(response.data);
      }
    } catch {
      toast.error("Failed to load projects");
    }
  };

  const getAllProjectsModuleData = async () => {
    try {
      const response = await getAllProjectModules();
      if (response.status === "success") {
        const data = response.data.map((item, index) => ({
          ...item,
          sno: index + 1,
        }));
        setModules(data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteProjectModuleData = async () => {
    if (!selectedProjectModule) return;

    try {
      const response = await deleteProjectModule({
        projectid: selectedProjectModule.projectid,
        moduleid: selectedProjectModule.moduleid,
      });

      if (response.status === "success") {
        toast.success(response.message);
        getAllProjectsModuleData();
      }
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setIsOpen(false);
      setSelectedProjectModule(null);
    }
  };

  /* ------------------ Initial Load ------------------ */

  useEffect(() => {
    const loadData = async () => {
      setIsPageLoading(true);
      await Promise.all([getAllProjectsData(), getAllProjectsModuleData()]);
      setIsPageLoading(false);
    };

    loadData();
  }, []);

  /* ------------------ Columns ------------------ */

  const columns = [
    { key: "sno", label: "S.No" },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="action-container">
          <img
            className="action-btn"
            src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png"
            alt="delete"
            height={17}
            width={15}
            onClick={() => {
              setIsOpen(true);
              setSelectedProjectModule(row);
            }}
          />
          <img
            className="action-btn"
            src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png"
            alt="edit"
            height={17}
            width={15}
            onClick={() => handleEdit(row)}
          />
        </div>
      ),
    },
    {
      key: "projectname",
      label: "Project Name",
      render: (value) => <div>{value ?? "-"}</div>,
    },
    { key: "modulename", label: "Module Name" },
    {
      key: "description",
      label: "Description",
      render: (value) => (
        <div>{value !== null && value !== "" ? value : "-"}</div>
      ),
    },
  ];

  if (isPageLoading) return <CustomLoadingindicator />;

  return (
    <div>
      <h3 style={{ color: "#06433e", marginBottom: "15px" }}>
        {isUpdate ? "Update Project Module" : "Create Project Module"}
      </h3>

      <div className="add-employee-container">
        <div className="add-employee-form">
          <CustomDropdownField
            label="Select Project"
            value={formData.projectid}
            error={fieldError.projectname}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const project = projects.find((p) => p.projectid === selectedId);

              handleChange("projectid", selectedId);
              handleChange("projectname", project?.projectname || "");
            }}
            options={projects.map((p) => ({
              value: p.projectid,
              label: p.projectname,
            }))}
          />

          <CustomTextField
            label="Module Name"
            value={formData.modulename}
            error={fieldError.modulename}
            onChange={(e) => handleChange("modulename", e.target.value)}
          />

          <CustomTextField
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div className="button-container">
          <CustomButton
            text={isSubmitting ? "Loading..." : isUpdate ? "Update" : "Submit"}
            onClick={handleSubmit}
          />
          <CustomButton text="Reset" isResetBtn={true} onClick={handleReset} />
        </div>
      </div>

      <h3
        style={{
          color: "#06433e",
          fontWeight: "600",
          marginTop: "30px",
        }}
      >
        Module List
      </h3>

      <CustomSearchField
        title="Search Module"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <DataTable
        columns={columns}
        data={modules.filter((mode) => {
          const searchText = (search || "").toLowerCase();
          return mode.modulename.toLowerCase().includes(searchText);
        })}
        loading={false}
        pageSize={10}
      />

      <ConfirmationDialog
        title={selectedProjectModule?.modulename || ""}
        isOpen={isOpen}
        onConfirm={deleteProjectModuleData}
        onCancel={() => {
          setIsOpen(false);
          setIsUpdate(false);
        }}
      />
    </div>
  );
}

export default ProjectModules;
