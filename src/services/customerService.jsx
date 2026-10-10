import apiClient from ".././services/apiClients";

// CREATE
export const createCustomer = async (data) => {
  const response = await apiClient.post(
    "/customers",
    data
  );

  return response.data;
};

// READ ALL
export const getCustomers = async () => {
  const response = await apiClient.get(
    "/customers"
  );

  return response.data;
};

// READ ONE
export const getCustomerById = async (id) => {
  const response = await apiClient.get(
    `/customers/${id}`
  );

  return response.data;
};

// UPDATE
export const updateCustomer = async (id, data) => {
  const response = await apiClient.put(
    `/customers/${id}`,
    data
  );

  return response.data;
};

// DELETE
export const deleteCustomer = async (id) => {
  const response = await apiClient.delete(
    `/customers/${id}`
  );

  return response.data;
};