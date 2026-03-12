import ApiRoutes from "../utils/api_routes";
import axiosInstance from "./api_service.js";

export const addProject = async (data) => {
  try {
    console.log(`-------------------------------------${JSON.stringify(data)}`);  
    const response = await axiosInstance.post(ApiRoutes.projectAdd, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const getAllProjects = async (status = "Active") => {
  try {
    const response = await axiosInstance.post(ApiRoutes.projectList, {
      status: status,
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const deleteProject = async (data) => {
  try {
    const response = await axiosInstance.post(ApiRoutes.projectDelete, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};
export const updateProject = async (data) => {
  try {
    const response = await axiosInstance.post(ApiRoutes.projectUpdate, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const updateProjectStatus = async (data) => {
  try {
    const response = await axiosInstance.post(
      ApiRoutes.updateProjectStatus,
      data,
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

/*  ----------------- Project Modules ----------------- */

export const addProjectModule = async (data) => {
  try {
    const response = await axiosInstance.post(ApiRoutes.projectModuleAdd, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const updateProjectModule = async (data) => {
  try {
    console.log(`------------------------${JSON.stringify(data)}`);
    const response = await axiosInstance.post(
      ApiRoutes.projectModuleUpdate,
      data,
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const getAllProjectModules = async () => {
  try {
    const response = await axiosInstance.post(ApiRoutes.projectModuleList, {});
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const deleteProjectModule = async (data) => {
  try {
    const response = await axiosInstance.post(
      ApiRoutes.projectModuleDelete,
      data,
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

/*  ----------------- Project Assignments ----------------- */

export const addAssignments = async (data) => {
  try {
    const response = await axiosInstance.post(ApiRoutes.assignmentsAdd, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const updateAssignments = async (data) => {
  try {
    console.log(`------------------------${JSON.stringify(data)}`);
    const response = await axiosInstance.post(
      ApiRoutes.assignmentsUpdate,
      data,
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const getProjectByModules = async (data) => {
  try {
    const response = await axiosInstance.post(ApiRoutes.projectByModules, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const getAllAssignments = async () => {
  try {
    const response = await axiosInstance.post(ApiRoutes.assignmentsList, {});
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};

export const deleteAssignment = async (data) => {
  try {
    const response = await axiosInstance.post(
      ApiRoutes.assignmentsDelete,
      data,
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Something went wrong");
  }
};
