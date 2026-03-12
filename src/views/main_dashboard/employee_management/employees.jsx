import React, { useEffect, useState } from "react";
import {
  CustomTextField,
  CustomDropdownField,
  CustomSearchField,
  ToggleSwitch,
} from "../../../components/custom_text_and_dropdown_field.jsx";
import "../../../styles/employee.css";
import CustomButton from "../../../components/custom_button.jsx";
import DataTable from "../../../components/custom_data_table.jsx";
import {
  addEmployees,
  deleteEmployee,
  getAllEmployees,
  updateEmployee,
  updateEmployeeStatus,
} from "../../../services/employee_service.js";
import { toast } from "react-toastify";
import CustomLoadingindicator from "../../../components/custom_loading.jsx";
import { ConfirmationDialog } from "../../../components/logout.jsx";
import ApiRoutes from "../../../utils/api_routes.js";

function Employees() {
  const [formData, setFormData] = useState({
    employeeid: 0,
    employeename: "",
    mobilenumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    designation: "",
    joiningdate: "",
    role: "",
    profile: null,
    profilePreview: null,
  });

  const [fieldError, setFieldError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [filterName, setFilterName] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    setFieldError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setFormData({
        ...formData,
        profile: file,
        profilePreview: URL.createObjectURL(file), // Generate a local preview URL
      });
    }
  };

  const handleReset = () => {
    setFormData({
      employeeid: 0,
      employeename: "",
      mobilenumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      designation: "",
      joiningdate: "",
      role: "",
      profile: null,
      profilePreview: null,
    });
    setFieldError({});
    setIsUpdate(false);
  };

  /* Employee List Data */


  const columns = [
    { key: "sno", label: "S.No" },
    {
      key: "actions",
      label: "Actions",
      render: (_, value) => {
        return (
          <div className="action-container">
            <img
              className="action-btn"
              src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png"
              alt="delete"
              height={17}
              width={15}
              onClick={() => {
                setIsOpen(true);
                setSelectedEmployee(value);
              }}
            />
            <img
              className="action-btn"
              src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png"
              alt="edit"
              height={17}
              width={15}
              onClick={() => {
                setFormData({
                  ...value,
                  profile: null,
                  profilePreview: value.profile
                    ? `${ApiRoutes.baseUrl}${value.profile}`
                    : null,
                });
                setIsUpdate(true);
              }}
            />
          </div>
        );
      },
    },
    {
      key: "profile",
      label: "Profile",
      render: (value) => {
        return value ? (
          <img
            src={`${ApiRoutes.baseUrl}${value}`}
            alt="Profile"
            className="table-profile-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://cdn-icons-png.flaticon.com/128/3135/3135715.png";
            }}
            style={{ objectFit: "contain" }}
          />
        ) : (
          <img
            src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
            alt="Profile"
            className="table-profile-img"
          />
        );
      },
    },
    { key: "employeename", label: "Employee Name" },
    { key: "mobilenumber", label: "Mobile Number" },
    { key: "email", label: "Email" },
    { key: "designation", label: "Designation" },
    {
      key: "joiningdate",
      label: "Joining Date",
      render: (value) => <div>{value}</div>,
    },
    { key: "role", label: "Role" },
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
      key: "update-status",
      label: "Update Status",
      render: (_, row) => (
        <ToggleSwitch
          label={""}
          checked={row.status === "Active"}
          onChange={async () => {
            const newStatus = row.status === "Active" ? "Inactive" : "Active";
            await updateStatus({
              employeeid: row.employeeid,
              status: newStatus,
            });
            setEmployees((prev) =>
              prev.map((emp) =>
                emp.employeeid === row.employeeid
                  ? { ...emp, status: newStatus }
                  : emp,
              ),
            );
          }}
        />
      ),
    },
  ];

  /* API Submit Function */
  const handleSubmit = async () => {
    const errors = {};

    if (!formData.employeename.trim())
      errors.employeename = "Please enter employee name";

    if (!formData.mobilenumber.trim())
      errors.mobilenumber = "Please enter mobile number";
    else if (!/^\d{10}$/.test(formData.mobilenumber))
      errors.mobilenumber = "Please enter a valid 10-digit mobile number";

    if (!formData.email.trim()) errors.email = "Please enter email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Please enter a valid email address";

    if (isUpdate && formData.password) {
      if (!formData.password) errors.password = "Please enter password";

      if (!formData.confirmPassword)
        errors.confirmPassword = "Please confirm password";

      if (
        formData.password &&
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
      )
        errors.confirmPassword = "Passwords do not match";
    }

    if (!isUpdate) {
      if (!formData.password) errors.password = "Please enter password";

      if (!formData.confirmPassword)
        errors.confirmPassword = "Please confirm password";

      if (
        formData.password &&
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
      )
        errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.designation) errors.designation = "Please enter designation";

    if (!formData.joiningdate)
      errors.joiningdate = "Please select joining date";

    if (!formData.role) errors.role = "Please select role";

    setFieldError(errors);

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "profilePreview") {
          if (formData[key] !== null && formData[key] !== undefined) {
            data.append(key, formData[key]);
          }
        }
      });

      let responseData;
      if (formData.employeeid !== 0 && formData.employeeid !== "") {
        responseData = await updateEmployee(data);
      } else {
        responseData = await addEmployees(data);
      }
      if (responseData.status === "success") {
        toast.success(
          isUpdate
            ? "Employee updated successfully!"
            : "Employee added successfully!",
        );
        handleReset();
        getAllEmployeeData();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAllEmployeeData = async () => {
    setIsLoading(true);
    try {
      const responseData = await getAllEmployees();
      if (responseData.status === "success") {
        const employeeData = responseData.data.map((data, index) => {
          return {
            ...data,
            sno: index + 1,
          };
        });
        setEmployees(employeeData);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to add employee");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async ({ employeeid, status }) => {
    try {
      const responseData = await updateEmployeeStatus({
        employeeid: employeeid,
        status: status,
      });
      if (responseData.status === "success") {
        toast.success(responseData.message);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const deleteEmployeeData = async () => {
    if (!selectedEmployee) return;
    try {
      const responseData = await deleteEmployee({
        employeeid: selectedEmployee.employeeid,
      });
      if (responseData.status === "success") {
        toast.success(responseData.message);
        getAllEmployeeData();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete employee");
    } finally {
      setIsOpen(false);
      setSelectedEmployee(null);
    }
  };

  useEffect(() => {
    getAllEmployeeData();
  }, []);

  if (isLoading) {
    return <CustomLoadingindicator />;
  }

  return (
    <div>
      <h3
        style={{
          color: "#06433e",
          marginBottom: "15px",
        }}
      >
        {isUpdate ? "Update Employee" : " Create Employee"}
      </h3>

      <div className="add-employee-container">
        <div className="profile-picker-container">
          <div
            className="profile-circle-wrapper"
            onClick={() => document.getElementById("profileInput").click()}
          >
            <img
              src={
                formData.profilePreview ||
                "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
              }
              alt="Profile"
              className="profile-circle"
              style={{ objectFit: "contain" }}
            />
            <div className="camera-overlay">
              <img
                src="https://cdn-icons-png.flaticon.com/128/846/846799.png"
                alt="Camera"
              />
            </div>
            <input
              id="profileInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="add-employee-form">
          <CustomTextField
            label="Employee Name"
            placeholder="Enter employee name"
            value={formData.employeename}
            onChange={(e) => handleChange("employeename", e.target.value)}
            error={fieldError.employeename}
          />
          <CustomTextField
            label="Mobile Number"
            placeholder="Enter employee mobile number"
            type="tel"
            maxLength={10}
            value={formData.mobilenumber}
            onChange={(e) => handleChange("mobilenumber", e.target.value)}
            error={fieldError.mobilenumber}
          />
          <CustomTextField
            label="Email"
            placeholder="Enter employee email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={fieldError.email}
          />
          <CustomTextField
            label="Password"
            placeholder="Enter employee password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={fieldError.password}
          />
          <CustomTextField
            label="Confirm Password"
            placeholder="Enter employee password again"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            error={fieldError.confirmPassword}
          />
          <CustomTextField
            label="Designation"
            placeholder="Enter employee designation"
            value={formData.designation}
            onChange={(e) => handleChange("designation", e.target.value)}
            error={fieldError.designation}
          />
          <CustomTextField
            label="Joining Date"
            type="date"
            value={formData.joiningdate}
            onChange={(e) => handleChange("joiningdate", e.target.value)}
            error={fieldError.joiningdate}
          />
          <CustomDropdownField
            label="Role"
            options={[
              { value: "Human Resources", label: "Human Resources" },
              { value: "Developer", label: "Developer" },
              { value: "Marketing", label: "Marketing" },
            ]}
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            error={fieldError.role}
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

      {/* Employee List */}
      <div>
        <h3 style={{ color: "#06433e", fontWeight: "600", marginTop: "30px" }}>
          Employee List
        </h3>

        <CustomSearchField
          title="Search Employee"
          value={filterName || ""}
          onChange={(e) => setFilterName(e.target.value)}
        />

        <DataTable
          columns={columns}
          data={employees.filter((emp) => {
            const searchText = (filterName || "").toLowerCase();
            return (
              emp.employeename.toLowerCase().includes(searchText) ||
              emp.mobilenumber.toLowerCase().includes(searchText) ||
              emp.email.toLowerCase().includes(searchText)
            );
          })}
          loading={false}
          pageSize={10}
        />
      </div>
      <ConfirmationDialog
        title={selectedEmployee?.employeename ?? ""}
        isOpen={isOpen}
        onConfirm={() => {
          setIsOpen(false);
          deleteEmployeeData();
        }}
        onCancel={() => {
          setIsOpen(false);
        }}
      />
    </div>
  );
}

export default Employees;
