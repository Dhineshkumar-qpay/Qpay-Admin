import ApiRoutes from "../utils/api_routes";
import axiosInstance from "./api_service.js";

export const addClient = async (data) => {
  try {
    const response = await axiosInstance.post(ApiRoutes.clientAdd, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const updateClient = async (data) => {
  try {
    const response = await axiosInstance.post(ApiRoutes.clientUpdate, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const getAllClients = async () => {
  try {
    const response = await axiosInstance.post(ApiRoutes.clientList, {});
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const updateClientStatus = async (data) => {
  try {
    const response = await axiosInstance.post(
      ApiRoutes.updateClientStatus,
      data,
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const deleteClient = async (data) => {
  try {
    const response = await axiosInstance.post(ApiRoutes.clientDelete, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};
