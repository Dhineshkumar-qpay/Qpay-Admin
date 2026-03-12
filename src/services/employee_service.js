import ApiRoutes from "../utils/api_routes";
import axiosInstance from "./api_service.js";

export const addEmployees = async (data) => {
  try {
    const response = await axiosInstance.post(ApiRoutes.addEmployee, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const updateEmployee = async (data) => {
  try {
    const response = await axiosInstance.post(ApiRoutes.employeeUpdate, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const getAllEmployees = async () => {
  try {
    const response = await axiosInstance.post(ApiRoutes.employeeList, {});
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const updateEmployeeStatus = async (data) => {
  try {
    const response = await axiosInstance.post(
      ApiRoutes.updateEmployeeStatus,
      data,
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const deleteEmployee = async (data) => {
  try {
    const response = await axiosInstance.post(ApiRoutes.employeeDelete, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};
