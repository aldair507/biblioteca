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
// En tu archivo api/api.js - CORREGIR updateRequest
export const updateRequest = async (request_id, updateData) => {
  try {
    console.log('Enviando update para request:', request_id, 'con datos:', updateData);
    
    // Probemos diferentes formatos según lo que espere tu backend
    const response = await api.put(`/requests/requests/${request_id}`, updateData);
    
    console.log('Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating request:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    throw error;
  }
};
export const deleteRequest = async (request_id) => {
  const response = await api.delete(`/requests/requests/${request_id}`);
  return response.data;
};

export const getRequests = async () => {
  const response = await api.get("/requests/requests/");
  return response.data;
};
