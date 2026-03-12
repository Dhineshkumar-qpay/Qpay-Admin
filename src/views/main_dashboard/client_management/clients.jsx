import React, { useEffect, useState } from "react";
import {
  CustomTextField,
  CustomSearchField,
  ToggleSwitch,
} from "../../../components/custom_text_and_dropdown_field.jsx";
import "../../../styles/employee.css";
import CustomButton from "../../../components/custom_button.jsx";
import DataTable from "../../../components/custom_data_table.jsx";
import {
  addClient,
  deleteClient,
  getAllClients,
  updateClient,
  updateClientStatus,
} from "../../../services/client_service.js";
import { toast } from "react-toastify";
import CustomLoadingindicator from "../../../components/custom_loading.jsx";
import { ConfirmationDialog } from "../../../components/logout.jsx";

function Clients() {
  const [formData, setFormData] = useState({
    clientid: 0,
    companyname: "",
    contactperson: "",
    email: "",
    phone: "",
    address: "",
  });

  const [fieldError, setFieldError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [clients, setClients] = useState([]);
  const [filterName, setFilterName] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

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

  const handleReset = () => {
    setFormData({
      clientid: 0,
      companyname: "",
      contactperson: "",
      email: "",
      phone: "",
      address: "",
    });
    setFieldError({});
    setIsUpdate(false);
  };

  /* Client List Data */
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
                setSelectedClient(value);
              }}
            />
            <img
              className="action-btn"
              src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png"
              alt="edit"
              height={17}
              width={15}
              onClick={() => {
                setFormData(value);
                setIsUpdate(true);
              }}
            />
          </div>
        );
      },
    },
    { key: "companyname", label: "Company Name" },
    { key: "contactperson", label: "Contact Person" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
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
              clientid: row.clientid,
              status: newStatus,
            });
            setClients((prev) =>
              prev.map((cli) =>
                cli.clientid === row.clientid
                  ? { ...cli, status: newStatus }
                  : cli,
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

    if (!formData.companyname.trim())
      errors.companyname = "Please enter company name";

    if (!formData.contactperson.trim())
      errors.contactperson = "Please enter contact person";

    if (!formData.email.trim()) errors.email = "Please enter email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Please enter a valid email address";

    if (!formData.phone.trim()) errors.phone = "Please enter phone number";
    else if (!/^\d{10}$/.test(formData.phone))
      errors.phone = "Please enter a valid 10-digit phone number";

    if (!formData.address.trim()) errors.address = "Please enter address";

    setFieldError(errors);

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      let responseData;
      if (formData.clientid !== 0 && formData.clientid !== "") {
        responseData = await updateClient(formData);
      } else {
        responseData = await addClient(formData);
      }
      if (responseData.status === "success") {
        toast.success(
          isUpdate
            ? "Client updated successfully!"
            : "Client added successfully!",
        );
        handleReset();
        getAllClientData();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit client data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAllClientData = async () => {
    setIsLoading(true);
    try {
      const responseData = await getAllClients();
      if (responseData.status === "success") {
        const clientData = responseData.data.map((data, index) => {
          return {
            ...data,
            sno: index + 1,
          };
        });
        setClients(clientData);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load clients");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async ({ clientid, status }) => {
    try {
      const responseData = await updateClientStatus({
        clientid: clientid,
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

  const deleteClientData = async () => {
    if (!selectedClient) return;
    try {
      const responseData = await deleteClient({
        clientid: selectedClient.clientid,
      });
      if (responseData.status === "success") {
        toast.success(responseData.message);
        getAllClientData();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete client");
    } finally {
      setIsOpen(false);
      setSelectedClient(null);
    }
  };

  useEffect(() => {
    getAllClientData();
  }, []);

  if (isLoading) {
    return <CustomLoadingindicator />;
  }

  return (
    <div>
      <h4 style={{ color: "#06433e", marginBottom: "15px" }}>
        {isUpdate ? "Update Client" : "Create Client"}
      </h4>

      <div className="add-employee-container">
        <div className="add-employee-form">
          <CustomTextField
            label="Company Name"
            placeholder="Enter company name"
            value={formData.companyname}
            onChange={(e) => handleChange("companyname", e.target.value)}
            error={fieldError.companyname}
          />
          <CustomTextField
            label="Contact Person"
            placeholder="Enter contact person"
            value={formData.contactperson}
            onChange={(e) => handleChange("contactperson", e.target.value)}
            error={fieldError.contactperson}
          />
          <CustomTextField
            label="Email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={fieldError.email}
          />
          <CustomTextField
            label="Phone Number"
            placeholder="Enter 10-digit phone number"
            type="tel"
            maxLength={10}
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={fieldError.phone}
          />
          <CustomTextField
            label="Address"
            placeholder="Enter full address"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            error={fieldError.address}
          />
        </div>

        <div className="button-container">
          <CustomButton
            text={isUpdate ? "Update" : isSubmitting ? "Loading..." : "Submit"}
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
          <CustomButton text="Reset" isResetBtn={true} onClick={handleReset} />
        </div>
      </div>

      {/* Client List */}
      <div>
        <h4 style={{ color: "#06433e", fontWeight: "600", marginTop: "30px" }}>
          Client List
        </h4>

        <CustomSearchField
          title="Search Client"
          value={filterName || ""}
          onChange={(e) => setFilterName(e.target.value)}
        />

        <DataTable
          columns={columns}
          data={clients.filter((cli) => {
            const searchText = (filterName || "").toLowerCase();
            return (
              cli.companyname.toLowerCase().includes(searchText) ||
              cli.contactperson.toLowerCase().includes(searchText) ||
              cli.email.toLowerCase().includes(searchText) ||
              cli.phone.toLowerCase().includes(searchText)
            );
          })}
          loading={false}
          pageSize={10}
        />
      </div>
      <ConfirmationDialog
        title={selectedClient?.companyname ?? ""}
        isOpen={isOpen}
        onConfirm={() => {
          setIsOpen(false);
          deleteClientData();
        }}
        onCancel={() => {
          setIsOpen(false);
        }}
      />
    </div>
  );
}

export default Clients;
