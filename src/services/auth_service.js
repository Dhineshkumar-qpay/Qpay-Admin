import ApiRoutes from "../utils/api_routes";
import axiosInstance from "./api_service.js";

export const login = async (data) => {
  try {
    const response = await axiosInstance.post(ApiRoutes.login, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};
