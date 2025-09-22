import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});


export const getBooks = async () => {
  const response = await api.get("/books");
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/users/users/");
  return response.data;
};

export const getRoles = async () => {
  const response = await api.get("/roles");
  return response.data;
};

export const createRequest = async (user_id, book_id) => {
  try {
    // Tu backend espera parámetros de query, no JSON en el body
    const response = await api.post(`/requests/requests/?user_id=${user_id}&book_id=${book_id}`);
    return response.data;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

// También necesitas la función updateRequest
export const updateRequest = async (request_id, updateData) => {
  try {
    const response = await api.put(`/requests/requests/${request_id}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating request:', error);
    throw error;
  }
};
export const getRequests = async () => {
  const response = await api.get("/requests/requests/");
  return response.data;
};