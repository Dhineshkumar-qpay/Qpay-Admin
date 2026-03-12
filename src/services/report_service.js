import ApiRoutes from "../utils/api_routes";
import axiosInstance from "./api_service.js";

export const getTotalDashCounts = async () => {
  try {
    const response = await axiosInstance.post(ApiRoutes.totalcounts);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};


export const getAllReports = async (data) => {
  try {
    const response = await axiosInstance.post(ApiRoutes.reportsAll, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const getTimeSheetSummary = async (data) => {
  try {
    const response = await axiosInstance.post(ApiRoutes.timesheetSummary, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};
