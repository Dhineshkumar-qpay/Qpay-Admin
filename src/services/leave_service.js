import ApiRoutes from "../utils/api_routes";
import axiosInstance from "./api_service.js";

export const getAllLeaves = async () => {
    try {
        const response = await axiosInstance.post(ApiRoutes.leaveList);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message ?? "Something went wrong");
    }
};

export const updateLeaveStatus = async (data) => {
    try {
        const response = await axiosInstance.post(ApiRoutes.updateLeaveStatus, data);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message ?? "Something went wrong");
    }
};
