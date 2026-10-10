import apiClient from "../services/apiClients";

export const signupUser = async (userData) => {
  const response = await apiClient.post(
    "/auth/signup",
    userData
  );

  return response.data;
};

export const loginUser = async (userData) => {
  const response = await apiClient.post(
    "/auth/login",
    userData
  );

  return response.data;
};